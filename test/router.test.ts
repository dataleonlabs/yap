import * as assert from 'assert';
import 'mocha';
import * as sinon from 'sinon';
import Router, { Context } from '../src/router';
import { getTestRequest } from './tools';

describe('Router', () => {

    it('U-TEST-1 - getMiddlewaresMatched with method', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST' },
            response: {}, fields: {}, connection: {},
        };

        router.register('POST', '/', () => { });
        router.register('DELETE', '/', () => { });
        router.register('GET', '/', () => { });
        router.register(null, '/', () => { });
        assert.equal(router.getMiddlewaresMatched().length, 2);
    });

    it('U-TEST-2 - getMiddlewaresMatched with path', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/contacts' },
            response: {}, fields: {}, connection: {},
        };

        router.register('POST', '/', () => { });
        router.register('POST', '/contacts', () => { });
        router.register('DELETE', '/', () => { });
        router.register('GET', '/', () => { });
        router.register(null, '/', () => { });
        assert.equal(router.getMiddlewaresMatched().length, 1);
    });

    it('U-TEST-3 - getMiddlewaresMatched with path home', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/' },
            response: {}, fields: {}, connection: {},
        };

        router.register('POST', '/', () => { });
        router.register('POST', '/contacts', () => { });
        router.register('DELETE', '/', () => { });
        router.register('GET', '/', () => { });
        router.register(null, '/', () => { });
        assert.equal(router.getMiddlewaresMatched().length, 2);
    });

    it('U-TEST-4 - getMiddlewaresMatched with path params', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/contacts/yap' },
            response: {}, fields: {}, connection: {},
        };

        router.register('POST', '/', () => { });
        router.register('POST', '/contacts/:id', () => { });
        router.register('DELETE', '/', () => { });
        router.register('GET', '/', () => { });
        router.register(null, '/', () => { });
        assert.equal(router.getMiddlewaresMatched().length, 1);
    });

    it('U-TEST-5 - getResponse', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/contacts/yap' },
            response: {}, fields: {}, connection: {},
        };

        const spyed = {
            middleware({ response, next }: Context) {
                response.body = response.body || '';
                response.body += 'hello';
                if (next) {
                    next();
                }
            },
        };

        const spy = sinon.spy(spyed, 'middleware');
        router.register('POST', '/', spyed.middleware);
        router.register('POST', '/contacts/:id', spyed.middleware);
        router.register(null, '/contacts/:id', spyed.middleware);
        router.register('DELETE', '/', spyed.middleware);
        router.register('GET', '/', spyed.middleware);
        router.register(null, '/', spyed.middleware);

        const res = await router.getResponse();

        assert.equal(spy.callCount, 2);
        assert.equal(res.body, 'hellohello');
    });

    it('U-TEST-6 - getResponse with Error', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/contacts/yap' },
            response: {}, fields: {}, connection: {},
        };

        const spyed = {
            middleware() {
                throw Error('hello error');
            },
        };

        const spy = sinon.spy(spyed, 'middleware');
        router.register('POST', '/', spyed.middleware);
        router.register('POST', '/contacts/:id', spyed.middleware);
        router.register('DELETE', '/', spyed.middleware);
        router.register('GET', '/', spyed.middleware);
        router.register(null, '/', spyed.middleware);

        const res = await router.getResponse();
        assert.equal(spy.callCount, 1);
        assert.equal(res.body, 'hello error');
    });

    it('U-TEST-7 - Test policies inbound', async () => {
        const router = new Router();
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.201.169";
        router.Context = {
            request,
            response: {}, fields: {}, connection: {},
            policies: `
                <policies>
                    <inbound>
                    <ip-filter action="allow">
                        <address>13.66.201.169</address>
                        <address-range from="13.66.140.128" to="13.66.255.143" />
                    </ip-filter>
                    </inbound>
                    <outbound/>
                </policies>
          `,
        };

        const spy = sinon.spy(router, 'triggerPolicy');
        await router.applyPolicies('inbound');
        assert.equal(spy.callCount, 1);

        await router.applyPolicies('inbound');
        assert.equal(spy.callCount, 2);
        spy.restore();
    });

    it('U-TEST-8 - Test policies inbound and outbound', async () => {
        const router = new Router();
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.140.129";
        router.Context = {
            request,
            response: {}, fields: {}, connection: {},
            policies: `
                <policies>
                    <inbound>
                    <ip-filter action="allow">
                        <address>13.66.140.129</address>
                        <address-range from="13.66.140.128" to="13.66.140.143" />
                    </ip-filter>
                    </inbound>
                    <outbound>
                    <ip-filter action="allow">
                        <address>13.66.140.129</address>
                        <address-range from="13.66.140.128" to="13.66.140.143" />
                    </ip-filter>
                    </outbound>
                </policies>
                    `,
        };

        const spy = sinon.spy(router, 'triggerPolicy');
        await router.applyPolicies('inbound');
        await router.applyPolicies('outbound');
        assert.equal(spy.callCount, 2);
        spy.restore();
    });

    it('U-TEST-9 - Test policies error', async () => {
        const router = new Router();
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.140.129";
        router.Context = {
            request,
            response: {}, fields: {}, connection: {},
            policies: `
                <policies>
                    <inbound>
                    <ip-filter action="allow">
                        <address>13.66.140.129</address>
                        <address-range from="13.66.140.128" to="13.66.140.143" />
                    </ip-filter>
                    </inbound>
                    <outbound>
                    <ip-filter action="allow">
                        <address>13.66.140.129</address>
                        <address-range from="13.66.140.128" to="13.66.140.143" />
                    </ip-filter>
                    </outbound>
                </policies>
          `,
        };

        const spy = sinon.spy(router, 'triggerPolicy');
        await router.applyPolicies('inbound');
        assert.equal(spy.callCount, 1);
        spy.restore();
    });

    it('U-TEST-10 - getResponse with next', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/contacts/yap' },
            response: {}, fields: {}, connection: {},
        };

        const spyed = {
            middleware({ response, next }: Context) {
                response.body = response.body || '';
                response.body += 'hello';
                if (next) {
                    next();
                }
            },
        };

        const spy = sinon.spy(spyed, 'middleware');
        router.register('POST', '/', spyed.middleware);
        router.register('POST', '/contacts/:id', spyed.middleware);
        router.register(null, '/contacts/:id', spyed.middleware);
        router.register('DELETE', '/', spyed.middleware);
        router.register('GET', '/', spyed.middleware);
        router.register(null, '/', spyed.middleware);

        const res = await router.getResponse();

        assert.equal(spy.callCount, 2);
        assert.equal(res.body, 'hellohello');
    });

    it('U-TEST-11 - getResponse with error throw', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/contacts/yap' },
            response: {}, fields: {}, connection: {},
        };

        const spyed = {
            middleware(context: Context) {
                if (context && context.throw) {
                    context.throw(422, 'hello error');
                }
            },
        };

        const spy = sinon.spy(spyed, 'middleware');
        router.register('POST', '/', spyed.middleware);
        router.register('POST', '/contacts/:id', spyed.middleware);
        router.register('POST', '/contacts/:id', spyed.middleware);
        router.register('POST', '/contacts/:id', spyed.middleware);
        router.register('DELETE', '/', spyed.middleware);
        router.register('GET', '/', spyed.middleware);
        router.register(null, '/', spyed.middleware);

        const res = await router.getResponse();
        assert.equal(spy.callCount, 1);
        assert.equal(res.body, 'hello error');
        assert.equal(res.statusCode, 422);
    });
});
