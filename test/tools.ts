/**
 * Creates mock request for testing
 */
export function getTestRequest() {
    return {
        httpMethod: 'GET',
        path: '',
        body: new Object(),
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
        fields: {},
        connection: {},
        policies: {},
    };
}
