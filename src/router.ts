import { Key, pathToRegexp } from 'path-to-regexp';

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
    readonly request: Request;

    /** response */
    response: Response;

    /** next function */
    next?: () => void;

    /** throw */
    throw?: (statusCode: number, body: any) => void;

    /** policies */
    readonly policies?: string;

    /** Fields */
    readonly fields: { [key: string]: any };

    /** connection */
    readonly connection: { [key: string]: any };
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
     * Get MiddlewaresMatched
     */
    public getMiddlewaresMatched(): Middleware[] {
        // Get middleware matched
        const middlewaresMatchedWithMethod = []
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
            if (middlewares.length) {
                // Loop
                for (const middleware of middlewares) {
                    await this.triggerMiddleWare(middleware);
                } 
            } else {
                this.context.response.statusCode = 404;
                this.context.response.body = 'Not found middleware';
            }

        } catch (error) {

            // Inject error
            this.context.response.statusCode = this.context.response.statusCode || 500;
            this.context.response.body = this.context.response.body || error;
        } finally {
            return this.context.response;
        }
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