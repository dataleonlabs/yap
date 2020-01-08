import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context as AWSContext } from 'aws-lambda';
import { get, set } from 'lodash';
import { xml2js } from 'xml-js';
import policyManager, { internalPolicies } from './policies';
import Policy, { Scope } from './policies/policy';

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

    /** Fields */
    readonly fields?: { [key: string]: any };

    /** Connection */
    readonly connection?: { [key: string]: any };

    /** Variables */
    readonly variables?: { [key: string]: any };

    /** Last execution error */
    LastError?: Error;
}

/**
 * Yap api gateway
 */
export default class Yap {

    /** policies */
    public policy: { [key: string]: Policy[] } = {};

    /**
     * Instance of lambda server
     */
    public lambdaServer: ApolloServer;

    /**
     * Instance of async lambda server handler
     */
    private lambdaServerHandler: (
        event: APIGatewayProxyEvent,
        context: AWSContext,
    ) => Promise<APIGatewayProxyResult>;

    /**
     * Creates YAP instance
     * @param args Graph QL Type definitions, resolvers. Policy XML definitions and custom policy handlers
     */
    constructor(args: {
        /**
         * Graph QL type definitions as string
         */
        typeDefs: string,

        /**
         * Graph QL resolvers
         */
        resolvers: any,
        /**
         * XML Definitions of policies
         */
        policiesXML?: string,

        /**
         * Custom policy handlers
         */
        policies?: Policy[],
    }) {
        const { typeDefs, resolvers, policies, policiesXML } = args;
        if (policies) {
            policies.map((policy) => policyManager.addPolicy(policy));
        }
        if (policiesXML) {
            this.loadPolicies(policiesXML);
        }
        this.lambdaServer = new ApolloServer({ typeDefs, resolvers });
        const awsHandler = this.lambdaServer.createHandler();
        this.lambdaServerHandler = (event: APIGatewayProxyEvent,
            context: AWSContext) => new Promise((resolve, reject) => {
                try {
                    awsHandler(event, context, (error?: Error | null | string, result?: APIGatewayProxyResult) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                } catch (callError) {
                    reject(callError);
                }
            });
    }

    /**
     * Request handler for AWS Labdas
     * @param awsEvent - AWS lambda event
     */
    public async handler(awsEvent: APIGatewayProxyEvent, awsContext: AWSContext): Promise<APIGatewayProxyResult> {
        const context = { request: awsEvent, LastError: undefined, response: { statusCode: 200, body: 'OK' } };
        try {
            await this.applyPolicies(Scope.inbound, context);

            const response = await this.lambdaServerHandler(context.request, awsContext);
            context.response = response;

            await this.applyPolicies(Scope.outbound, context);

        } catch (error) {
            try {
                context.LastError = error;
                await this.applyPolicies(Scope.onerror, context);
                set(context, 'response.statusCode', get(context, 'response.statusCode', 500));
                set(context, 'response.body', get(context, 'response.body', error));
            } catch (applyOnErrorPoliciesError) {
                set(context, 'response.statusCode', get(context, 'response.statusCode', 500));
                set(context, 'response.body', get(context, 'response.body', applyOnErrorPoliciesError));
            }
        }
        return context.response;
    }

    /**
     * Apply policies
     */
    public async applyPolicies(scope: Scope, context: Context): Promise<boolean> {
        if (this.policy[scope]) {
            for (const policyElement of this.policy[scope]) {
                await this.triggerPolicy(policyElement, scope, context);
            }
        }
        return true;
    }

    /**
     * Deletes policy with id from server
     * @param id id of policy
     */
    public deletePolicy(id: string) {
        for(const [scope, policies] of Object.entries(this.policy)) {
            for(let i=0; i<policies.length; i++) {
                if(this.policy[scope][i].name === id) {
                    policies.splice(i, 1);
                    policyManager.deletePolicy(id);
                    break;
                }
            }
        }
    }

    /**
     * triggerPolicy
     * Manage next and throw function
     */
    public triggerPolicy(policyElement: any, scope: Scope, context: Context) {
        return new Promise(async (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
            // functio next
            context.next = () => resolve();
            context.throw = (statusCode: number, body: string) => {
                context.response.statusCode = statusCode;
                context.response.body = body;
                reject(body);
            };

            try {
                await policyManager.apply({ policyElement, context, scope });
                resolve();
            } catch (error) {
                context.response.statusCode = 500;
                context.response.body = error.message;
                reject(error);
            }
        });
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
                    errors.push(`policies-ERR-002: XML tag <policies/> must only contains `
                        + `<inbound />, <outbound />, <on-error /> XML Tag, found <${policy.name}>`);
                } else {
                    if (!(policy.elements instanceof Array)) {
                        errors.push(
                            `policies-ERR-003: XML tag <policies/> should contains at least one policy. Tag <${policy.name}> have no elements`);
                    } else {
                        for (const policyElement of policy.elements) {
                            const policyInstance = policyManager.getPolicy(policyElement.name);
                            if (!policyInstance) {
                                errors.push(`policies-ERR-004: XML tag <${policy.name}> contains unknown policy <${policyElement.name}>. `
                                    + `Please, load definition for this policy before loading of XML`);
                            } else {
                                if (validateAllPolicies || internalPolicies.indexOf(policyInstance.id) > -1) {
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
        this.policy = {};
        for (const entry of parsedXML.elements[0].elements) {
            this.policy[entry.name] = entry.elements;
        }
    }

}