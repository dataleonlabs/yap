export function getTestRequest () {
    return {
        httpMethod: 'GET',
        path: '',
        requestContext: {
            accountId: "",
            apiId: "",
            authorizer: {},
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
                userArn: null
            }
        }
    }
}