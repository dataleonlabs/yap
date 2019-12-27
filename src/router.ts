import { get } from 'lodash';
import { Key, pathToRegexp } from 'path-to-regexp';
import { xml2js } from 'xml-js';
import policyManager, { IPolicy, Scope } from './policies';

// API Gateway "event"
export interface Request {
    /** body */
    body?: any;
    /** headers */
    headers?: { [name: string]: string };
    /** headers */
    params?: { [name: string]: string };
    /** multiValueHeaders */
    multiValueHeaders?: { [name: string]: string[] };
    /** httpMethod */
    httpMethod?: string;
    /** isBase64Encoded */
    isBase64Encoded?: boolean;
    /** path */
    path?: string;
    /** pathParameters */
    pathParameters?: { [name: string]: string } | null;
    /** queryStringParameters */
    queryStringParameters?: { [name: string]: string } | null;
    /** multiValueQueryStringParameters */
    multiValueQueryStringParameters?: { [name: string]: string[] } | null;
    /** stageVariables */
    stageVariables?: { [name: string]: string } | null;
    /** requestContext */
    requestContext?: {
        /** accountId */
        accountId: string;
        /** apiId */
        apiId: string;
        /** authorizer */
        authorizer?: any;
        /** connectedAt */
        connectedAt?: number;
        /** connectionId */
        connectionId?: string;
        /** domainName */
        domainName?: string;
        /** domainPrefix */
        domainPrefix?: string;
        /** eventType */
        eventType?: string;
        /** extendedRequestId */
        extendedRequestId?: string;
        /** httpMethod */
        httpMethod: string;
        /** identity */
        identity: {
            /** accessKey */
            accessKey: string | null;
            /** accountId */
            accountId: string | null;
            /** apiKey */
            apiKey: string | null;
            /** apiKeyId */
            apiKeyId: string | null;
            /** caller */
            caller: string | null;
            /** cognitoAuthenticationProvider */
            cognitoAuthenticationProvider: string | null;
            /** cognitoAuthenticationType */
            cognitoAuthenticationType: string | null;
            /** cognitoIdentityId */
            cognitoIdentityId: string | null;
            /** cognitoIdentityPoolId */
            cognitoIdentityPoolId: string | null;
            /** sourceIp */
            sourceIp: string;
            /** user */
            user: string | null;
            /** userAgent */
            userAgent: string | null;
            /** userArn */
            userArn: string | null;
        };
        /** messageDirection */
        messageDirection?: string;
        /** messageId */
        messageId?: string | null;
        /** path */
        path: string;
        /** stage */
        stage: string;
        /** requestId */
        requestId: string;
        /** requestTime */
        requestTime?: string;
        /** requestTimeEpoch */
        requestTimeEpoch: number;
        /** resourceId */
        resourceId: string;
        /** resourcePath */
        resourcePath: string;
        /** routeKey */
        routeKey?: string;
    };
    /** resource */
    resource?: string;
}

export interface Response {
    /** body */
    body?: any;
    /** statusCode */
    statusCode?: number;
    /** headers */
    headers?: { [key: string]: any };
}

export interface Context {
    /** request */
    request: Request;

    /** response */
    response: Response;

    /** next function */
    next?: () => void;

    /** throw */
    throw?: (statusCode: number, body: any) => void;

    /** policies */
    policy?: { [key: string]: string[] };

    /** Fields */
    readonly fields?: { [key: string]: any };

    /** Connection */
    readonly connection?: { [key: string]: any };

    /** Variables */
    readonly variables?: { [key: string]: any };
}

export interface Middleware {
    /** method of request */
    method: null | 'GET' | 'POST' | 'PUT' | 'DELETE';

    /** path of request */
    path: string;

    /** middleware registed */
    action: (context: Context) => any;
}

/**
 * Router
 */
export default class Router {
    /**
     * Middlewares
     * @param {Object} middlewares Middlewares available for request
     */
    private middlewares: Middleware[] = [];

    /**
     * Fields
     * @param {Object} fields fields from ui interface
     */
    private context: Context = { request: {}, response: {}, fields: {}, connection: {} };

    /**
     * Loads context to router
     * @param {Context} context Context of request
     */
    public set Context(context: Context) {
        this.context = context;
    }

    /**
     * Returns context from router
     */
    public get Context() {
        return this.context;
    }

    /**
     * Validates policy definition and policies. By default validating only internal policies
     * @param parsedPolicies Parsed policy XML
     * @param validateAllPolicies should validate all policies including custom policies
     */
    public validatePolicies(parsedPolicies: object, validateAllPolicies?: boolean) {
        //avoid double parsing
        let errors: string[] = [];
        const policiesContainer = get(parsedPolicies, 'elements[0]');
        if (!policiesContainer
            || policiesContainer.name !== "policies"
            || !(policiesContainer.elements instanceof Array)
            || !policiesContainer.elements.length) {
            errors.push('policies-ERR-001: XML should contain root element <policies> with scopes');
        } else {
            for (const policy of policiesContainer.elements) {
                if (Object.values(Scope).indexOf(policy.name) === -1) {
                    errors.push(`policies-ERR-002: XML tag <policies/> must only contains <inbound />, <outbound />, <on-error /> XML Tag, found <${policy.name}>`);
                } else {
                    if (!(policy.elements instanceof Array)) {
                        errors.push(
                            `policies-ERR-003: XML tag <policies/> should contains at least one policy. Tag <${policy.name}> have no elements`);
                    } else {
                        for (const policyElement of policy.elements) {
                            const policyInstance = policyManager.getPolicy(policyElement.name);
                            if (!policyInstance) {
                                errors.push(`policies-ERR-004: XML tag <${policy.name}> contains unknown policy <${policyElement.name}>. Please, load definition for this policy before loading of XML`);
                            } else {
                                if (policyInstance.isInternal || validateAllPolicies) {
                                    const policyInstanceErrors = policyInstance.validate(policyElement);
                                    if (policyInstanceErrors.length) {
                                        errors = [...errors, ...policyInstanceErrors];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return errors;
    }

    /**
     * Loads policies from XML file
     * Use @validatePolicies to validate XML string first
     * @param xml policy in a format of XML
     */
    public loadPolicies(xml: string) {
        const parsedXML = xml2js(xml);
        const validationResult = this.validatePolicies(parsedXML, false);
        if (validationResult.length) {
            throw new Error(`Error validating policies. Please, fix errors in XML: \n ${validationResult.join('\n')}`);
        }
        this.context.policy = {};
        for (const entry of parsedXML.elements[0].elements) {
            this.context.policy[entry.name] = entry.elements;
        }
    }

    /**
     * Get MiddlewaresMatched
     */
    public getMiddlewaresMatched(): Middleware[] {
        // Get middleware matched
        const middlewaresMatchedWithMethod = [];
        for (const middleware of this.middlewares) {

            if (this.context.request.path) {
                const keys: Key[] = [];
                const regexp = pathToRegexp(middleware.path, keys);
                const match = regexp.exec((this.context.request.path as string));
                // Dont match
                if (match === null) {
                    continue;
                }

                const params: { [key: string]: string } = {};
                for (let index = 1; index < match.length; index++) {
                    params[keys[index - 1].name] = match[index];
                    this.context.request.params = params;
                }
            }

            if (middleware.method === null) {
                middlewaresMatchedWithMethod.push(middleware);
            } else if (middleware.method === (this.context.request.httpMethod as string).toLocaleUpperCase()) {
                middlewaresMatchedWithMethod.push(middleware);
            }
        }

        return middlewaresMatchedWithMethod;
    }

    /**
     * triggerMiddleWare
     * Manage next and throw function
     */
    public triggerMiddleWare = (middleware: Middleware) => {
        return new Promise(async (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
            // functio next
            this.context.next = () => resolve();
            this.context.throw = (statusCode: number, body: string) => {
                this.context.response.statusCode = statusCode;
                this.context.response.body = body;
                reject(body);
            };

            try {
                await middleware.action(this.context);
            } catch (error) {
                this.context.response.statusCode = 500;
                this.context.response.body = error.message;
                reject(error);
            }
        });
    }

    /**
     * Get response
     */
    public async getResponse(): Promise<Response> {
        // Get middlewares matched
        const middlewares = this.getMiddlewaresMatched();
        try {
            await this.applyPolicies(Scope.inbound);
            if (middlewares.length) {
                // Loop
                for (const middleware of middlewares) {
                    await this.triggerMiddleWare(middleware);
                }
                await this.applyPolicies(Scope.outbound);
            } else {
                this.context.response.statusCode = 404;
                this.context.response.body = 'Not found middleware';
            }

        } catch (error) {
            try {
                await this.applyPolicies(Scope.onerror);
                this.context.response.statusCode = this.context.response.statusCode || 500;
                this.context.response.body = this.context.response.body || error;
            } catch (applyOnErrorPoliciesError) {
                this.context.response.statusCode = this.context.response.statusCode || 500;
                this.context.response.body = this.context.response.body || applyOnErrorPoliciesError;
            }
        }

        return this.context.response;
    }

    /**
     * Apply policies
     */
    public async applyPolicies(scope: Scope): Promise<boolean> {
        if (this.context.policy && this.context.policy[scope]) {
            for (const policyElement of this.context.policy[scope]) {
                await this.triggerPolicy(policyElement, scope);
            }
        }
        return true;
    }

    /**
     * triggerPolicy
     * Manage next and throw function
     */
    public triggerPolicy = (policyElement: any, scope: Scope) => {
        return new Promise(async (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
            // functio next
            this.context.next = () => resolve();
            this.context.throw = (statusCode: number, body: string) => {
                this.context.response.statusCode = statusCode;
                this.context.response.body = body;
                reject(body);
            };

            try {
                await policyManager.apply({ policyElement, context: this.context, scope });
                resolve();
            } catch (error) {
                this.context.response.statusCode = 500;
                this.context.response.body = error.message;
                reject(error);
            }
        });
    }

    /**
     * Get response
     */
    public register(
        method: Middleware['method'],
        path: Middleware['path'],
        action: Middleware['action'],
    ): void {
        this.middlewares.push({ method, path, action });
    }
}