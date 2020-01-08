/**
 * Creates mock request for testing
 */
export function getTestRequest() {
    const request = {
        httpMethod: 'GET',
        path: '',
        body: new Object(),
        headers: {},
        requestContext: {
            accountId: "",
            apiId: "",
            authorizer: {},
            headers: {},
            connectedAt: 1,
            connectionId: "",
            domainName: "",
            domainPrefix: "",
            eventType: "",
            extendedRequestId: "",
            httpMethod: "",
            path: "",
            stage: "",
            requestId: "",
            requestTimeEpoch: 0,
            resourceId: "",
            resourcePath: "",
            identity: {
                accessKey: null,
                accountId: null,
                apiKey: null,
                apiKeyId: null,
                caller: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                sourceIp: "127.0.0.1",
                user: null,
                userAgent: null,
                userArn: null,
            },
        },
    };
    return request;
}

/**
 * Creates mock responce for testing
 */
export function getTestResponce() {
    return {
        body: {},
        statusCode: 200,
        headers: {},
    };
}

/**
 * Creates mock context for testing
 */
export function getTestContext() {
    return {
        request: getTestRequest(),
        response: getTestResponce(),
        variables: {},
        connection: {},
        policies: {},
    };
}

/**
 * Creates test AWS context
 */
export function getTestAwsContext() {
    return {
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
    };
}