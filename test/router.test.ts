import * as assert from 'assert';
import 'mocha';
import * as sinon from 'sinon';
import { xml2js } from 'xml-js';
import { Scope } from '../src/policies/policy';
import Router, { Context } from '../src/router';
import { getTestRequest } from './tools';

describe('Router', () => {

    it('U-TEST-1 - getMiddlewaresMatched with method', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST' },
            response: {}, variables: {}, connection: {},
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
            response: {}, variables: {}, connection: {},
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
            response: {}, variables: {}, connection: {},
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
            response: {}, variables: {}, connection: {},
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
            response: {}, variables: {}, connection: {},
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
            response: {}, variables: {}, connection: {},
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

    it("U-TEST-7 - Should load policy structure, and trigger validation", () => {
        const router = new Router();
        const xml = `
        <policies>
            <inbound>
                <set-status code="401" reason="Unauthorized"/>
            </inbound>
            <outbound>
                <set-variable name="server" value="prod" />
            </outbound>
            <on-error>
                <set-status code="500" reason="Server error"/>
            </on-error>
        </policies>
        `;
        const spyValidate = sinon.spy(router, 'validatePolicies');
        router.loadPolicies(xml);
        assert.deepEqual(router.policy, {
            "inbound": [
                {
                    attributes: {
                        code: "401",
                        reason: "Unauthorized",
                    },
                    name: "set-status",
                    type: "element",
                },
            ],
            "outbound": [
                {
                    attributes: {
                        name: "server",
                        value: "prod",
                    },
                    name: "set-variable",
                    type: "element",
                },
            ],
            "on-error": [
                {
                    attributes: {
                        code: "500",
                        reason: "Server error",
                    },
                    name: "set-status",
                    type: "element",
                },
            ],
        });
        assert.ok(spyValidate.calledOnceWithExactly(xml2js(xml), false));
    });

    it("U-TEST-8 - Should validate policy structure", () => {
        const router = new Router();
        const xml = `<policies>
                        <inbound>
                            <set-status code="401" reason="Unauthorized"/>
                        </inbound>
                        <outbound>
                            <set-variable name="server" value="prod" />
                        </outbound>
                        <on-error>
                            <set-status code="500" reason="Server error"/>
                        </on-error>
                    </policies>`;
        const parsedXML = xml2js(xml);
        const validationResult = router.validatePolicies(parsedXML);
        assert.deepEqual(validationResult, []);
    });

    it("U-TEST-9 - Should validate policy structure with validation errors", () => {
        const router = new Router();
        const xml = `<policies>
                        <inboundу>
                            <set-status code="401" reason="Unauthorized"/>
                        </inboundу>
                        <outbound>
                        </outbound>
                        <on-error>
                            <set-status code="500" reason="Server error"/>
                            <unknown-policy/>
                            <check-header/>
                        </on-error>
                    </policies>`;
        const parsedXML = xml2js(xml);
        const validationResult = router.validatePolicies(parsedXML);
        assert.deepEqual(validationResult, [
            "policies-ERR-002: XML tag <policies/> must only contains <inbound />, <outbound />, <on-error /> XML Tag, found <inboundу>",
            "policies-ERR-003: XML tag <policies/> should contains at least one policy. Tag <outbound> have no elements",
            "policies-ERR-004: XML tag <on-error> contains unknown policy <unknown-policy>. Please, load definition for this policy before loading of XML",
            "check-header-ERR-001: attribute 'failed-check-error-message' is required",
            "check-header-ERR-002: attribute 'failed-check-httpcode' is required and should be integer",
            "check-header-ERR-003: attribute 'name' is required",
            "check-header-ERR-004: attribute 'ignore-case' is required, and should be either true or false"]);
    });

    it('U-TEST-10 - Test policies inbound', async () => {
        const router = new Router();
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.201.169";
        router.Context = {
            request,
            response: {}, variables: {}, connection: {},
        };
        router.loadPolicies(`
        <policies>
            <inbound>
                <ip-filter action="allow">
                    <address>13.66.201.169</address>
                    <address-range from="13.66.140.128" to="13.66.255.143" />
                </ip-filter>
            </inbound>
        </policies>`);

        const spy = sinon.spy(router, 'triggerPolicy');
        await router.applyPolicies(Scope.inbound);
        assert.equal(spy.callCount, 1);

        await router.applyPolicies(Scope.inbound);
        assert.equal(spy.callCount, 2);
        spy.restore();
    });

    it('U-TEST-11 - Test policies inbound and outbound', async () => {
        const router = new Router();
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.140.129";
        router.Context = {
            request,
            response: {}, variables: {}, connection: {},
        };

        router.loadPolicies(`
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
        </policies>`);

        const spy = sinon.spy(router, 'triggerPolicy');
        await router.applyPolicies(Scope.inbound);
        await router.applyPolicies(Scope.outbound);
        assert.equal(spy.callCount, 2);
        spy.restore();
    });

    it('U-TEST-12 - Test policies error', async () => {
        const router = new Router();
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.140.129";
        router.Context = {
            request,
            response: {}, variables: {}, connection: {},
        };

        router.loadPolicies(`
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
        </policies>`);

        const spy = sinon.spy(router, 'triggerPolicy');
        await router.applyPolicies(Scope.inbound);
        assert.equal(spy.callCount, 1);
        spy.restore();
    });

    it('U-TEST-13 - getResponse with next', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/contacts/yap' },
            response: {}, variables: {}, connection: {},
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

    it('U-TEST-14 - getResponse with error throw', async () => {
        const router = new Router();
        router.Context = {
            request: { httpMethod: 'POST', path: '/contacts/yap' },
            response: {}, variables: {}, connection: {},
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
