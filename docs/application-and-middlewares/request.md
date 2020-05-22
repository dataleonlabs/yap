# Request

The `request` object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on. In this documentation and by convention, the object is always referred to as `request` \(and the HTTP response is `response`\).

```typescript
// API Gateway "event"
interface Request {
    /** Contains key-value pairs of data submitted in the request body. */
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
```

{% hint style="info" %}
Yap use Amazon API Gateway API Request and Response Data Mapping Reference
{% endhint %}

