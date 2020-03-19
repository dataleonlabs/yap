import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context as AWSContext } from "aws-lambda";
import http from "http";
import { get, set } from "lodash";
import { xml2js } from "xml-js";
import { Context, Scope } from ".";
import directives from "./directives";
import policyManager, { internalPolicies } from "./policies";
import Policy from "./policies/policy";
import scalars from "./scalars";
const colors = require('colors/safe');

/**
 * Options for http server
 */
interface Options {
    /** env for debug log */
    env: "development" | "production";
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
     * httpServer
     */
    public server: http.Server | null = null;

    /**
     * Instance of async lambda server handler
     */
    private lambdaServerHandler: (
        context: Context,
        awsContext: AWSContext,
    ) => Promise<APIGatewayProxyResult>;

    /**
     * Creates YAP instance
     * @param args Graph QL Type definitions, resolvers. Policy XML definitions and custom policy handlers
     */
    constructor(args: {
        /**
         * Graph QL type definitions as string
         */
        typeDefs: string | string[],

        /**
         * Graph QL Directives
         */
        schemaDirectives?: { [key: string]: any},

        /**
         * Graph QL resolvers
         */
        resolvers: any,
        /**
         * XML Definitions of policies
         */
        policies?: string,

        /**
         * Custom policy handlers
         */
        customPolicies?: Policy[],
    }) {
        const { resolvers, policies, customPolicies } = args;
        let { typeDefs, schemaDirectives } = args;
        if (customPolicies) {
            customPolicies.map((policy) => policyManager.addPolicy(policy));
        }
        if (policies) {
            this.loadPolicies(policies);
        }
        if(typeof typeDefs === "string") {
            typeDefs = [scalars.typeDefs, typeDefs];
        }
        if(!schemaDirectives) {
            schemaDirectives = {};
        }
        for(const [ directiveKey, directive] of Object.entries(directives)) {
            typeDefs.push(directive.definition);
            schemaDirectives[directiveKey] = directive.directive;
        }

        this.lambdaServer = new ApolloServer({ typeDefs, resolvers: { ...scalars.resolvers, ...resolvers }, schemaDirectives });
        const awsHandler = this.lambdaServer.createHandler();
        this.lambdaServerHandler = (context: Context,
            awsContext: AWSContext) => new Promise((resolve, reject) => {
                try {
                    awsHandler(
                        context.request as APIGatewayProxyEvent,
                        context as any,
                        (error?: Error | null | string, result?: APIGatewayProxyResult) => {
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

            const response = await this.lambdaServerHandler(context, awsContext);
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
     * Listen for connections.
     *
     * A node `http.Server` is returned, with this
     * application (which is a `Function`) as its
     * callback. If you wish to create both an HTTP
     * and HTTPS server you may do so with the "http"
     * and "https" modules as shown here:
     *
     *    var http = require('http')
     *      , https = require('https')
     *      , yap = require('yap')
     *      , app = new Yap();
     *
     *    http.createServer(app).listen(80);
     *    https.createServer({ ... }, app).listen(443);
     *
     * @return {http.Server}
     * @public
     */
    public listen(port: number, options?: Options): http.Server {
        this.server = http.createServer(async (req: any, res: any) => {
            let body: any = [];
            req.on('data', (chunk: string) => {
                body.push(chunk);
            });
            req.on('end', () => {
                body = Buffer.concat(body).toString();
            });
            const event: any = {
                httpMethod: req.method,
                ...req,
                body,
            };
            const queryResponse = await this.handler(event, {
                callbackWaitsForEmptyEventLoop: false,
                functionName: "1",
                functionVersion: "1",
                invokedFunctionArn: "1",
                memoryLimitInMB: "100",
                awsRequestId: "1",
                logGroupName: "1",
                logStreamName: "1",
                getRemainingTimeInMillis: () => 1,
                done: (error?: Error, result?: any) => void 0,
                fail: (error: Error | string) => void 0,
                succeed: (messageOrObject: any) => void 0,
            });
            res.writeHead(queryResponse.statusCode, queryResponse.headers);
            res.write(queryResponse.body);

            if (options && options.env === "development") {
                console.info(
                    (queryResponse.statusCode < 400 ? colors.green.bold(req.method) : colors.red.bold(req.method))
                    + ' ' + req.url + ' - ' + queryResponse.statusCode);
            }

            res.end();
        });
        return this.server.listen(port) as http.Server;
    }

    /**
     * Close server
     */
    public close() {
        if (this.server) {
            return this.server.close();
        }
    }

    /**
     * Apply policies
     */
    public async applyPolicies(scope: Scope, context: Context): Promise<boolean> {
        if (this.policy[scope]) {
            for (const policyElement of this.policy[scope]) {
                await policyManager.apply({ policyElement, context, scope });
            }
        }
        return true;
    }

    /**
     * Deletes policy with id from server
     * @param id id of policy
     */
    public deletePolicy(id: string) {
        for (const [scope, policies] of Object.entries(this.policy)) {
            for (let i = 0; i < policies.length; i++) {
                if (this.policy[scope][i].name === id) {
                    policies.splice(i, 1);
                    policyManager.deletePolicy(id);
                    break;
                }
            }
        }
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