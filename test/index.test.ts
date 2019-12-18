import 'mocha';
import assert from 'assert';
import * as sinon from 'sinon';
import Yap from '../src/index';

describe('Core', () => {
    it('U-TEST-1 - Constructor creates router', () => {
        const yap = new Yap();
        assert(yap.Router);
    });

    it('U-TEST-2 - Execute pass context and calls getResponse', async () => {
        const yap = new Yap();
        const mock = sinon.mock(yap.Router);
        const request = {
            body: { a: 1 },
            httpMethod: 'GET',
            path: '/'
        }
        const context = {
            request,
            response: {}
        }
        await yap.execute(request);
        assert.deepEqual(yap.Router.Context.request, context.request);
        mock.expects("getResponse").once();
    });

    it('U-TEST-3 - AWS execute correctly pass context to handler function', async () => {
        const yap = new Yap();
        const awsEvent = {
            body: null,
            headers: {},
            multiValueHeaders: {},
            httpMethod: "",
            isBase64Encoded: false,
            path: "/api",
            pathParameters: null,
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            stageVariables: null,
            requestContext: {
                accountId: "",
                apiId: "",
                authorizer: null,
                connectedAt: 0,
                connectionId: "",
                domainName: "",
                domainPrefix: "",
                eventType: "",
                extendedRequestId: "",
                httpMethod: "",
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
                    principalOrgId: null,
                    sourceIp: "",
                    user: null,
                    userAgent: null,
                    userArn: null,
                },
                messageDirection: "",
                messageId: null,
                path: "",
                stage: "",
                requestId: "",
                requestTime: "",
                requestTimeEpoch: 0,
                resourceId: "",
                resourcePath: "",
                routeKey: "",
            },
            resource: "",
        };
        const context = {
            request: awsEvent,
            response: {},
            fields: {},
            connection: {}
        }
        const stub = sinon.stub(yap.Router, "getResponse")
        await yap.handler(awsEvent);
        assert.deepEqual(yap.Router.Context.request, context.request);
        assert.equal(stub.callCount, 1);
    });

    it('U-TEST-4 - get registers GET middleware', async () => {
        const yap = new Yap();
        const mock = sinon.mock(yap.Router);
        const path = '/somepath';
        const action = () => {};
        yap.get(path, action);
        mock.expects("register").once().withExactArgs('GET', path, action);
    });

    it('U-TEST-5 - post registers POST middleware', async () => {
        const yap = new Yap();
        const mock = sinon.mock(yap.Router);
        const path = '/somepath';
        const action = () => { };
        yap.post(path, action);
        mock.expects("register").once().withExactArgs('POST', path, action);
    });

    it('U-TEST-6 - put registers PUT middleware', async () => {
        const yap = new Yap();
        const mock = sinon.mock(yap.Router);
        const path = '/somepath';
        const action = () => { };
        yap.put(path, action);
        mock.expects("register").once().withExactArgs('PUT', path, action);
    });

    it('U-TEST-7 - delete registers DELETE middleware', async () => {
        const yap = new Yap();
        const mock = sinon.mock(yap.Router);
        const path = '/somepath';
        const action = () => { };
        yap.delete(path, action);
        mock.expects("register").once().withExactArgs('DELETE', path, action);
    });

    it('U-TEST-8 - delete registers ALL middleware', async () => {
        const yap = new Yap();
        const mock = sinon.mock(yap.Router);
        const path = '/somepath';
        const action = () => { };
        yap.all(path, action);
        mock.expects("register").once().withExactArgs(null, path, action);
    });
});