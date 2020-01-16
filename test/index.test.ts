import assert from 'assert';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context as AWSContext } from 'aws-lambda';
import AWS from 'aws-sdk';
import { get, set } from 'lodash';
import 'mocha';
import * as sinon from 'sinon';
import { xml2js } from 'xml-js';
import Yap, { Context, Scope, ExecutionContext, PolicyCategory, YapConnector, Connector, } from '../src/index';
import policyManager from '../src/policies';
import { getTestAwsContext, getTestContext, getTestRequest } from './tools';
import { ConnectorCategory } from '../src/connectors/connector';

describe('Core', () => {

    const result = [
        {
            id: "1",
            data: "first",
        },
        {
            id: "2",
            data: "second",
        },
    ];
    const typeDefs = `
        type Query { fields: [Field] }
        type Field { id: String, data: String }
    `;

    const query = JSON.stringify({
        query: "query fields{ fields { id, data } }",
    });

    @YapConnector({
        id: "testConnector",
        name: "testConnector",
        category: ConnectorCategory.dataprocessing,
        description: "testDescription"
    })
    class TestConnector extends Connector {
        public async execute(parent: any, args: any, context: Context, info: any) {
            return new Promise(res => res(result));
        }
    }
    @YapConnector({
        id: "testErrorConnector",
        name: "testErrorConnector",
        category: ConnectorCategory.dataprocessing,
        description: "testDescription"
    })
    class TestErrorConnector extends Connector {
        public execute(parent: any, args: any, context: Context, info: any) {
            throw new Error("Some error");
        }
    }

    const testConnector = new TestConnector;

    const resolvers = {
        Query: { fields: testConnector.execute },
    };

    it('U-TEST-1 - Creates Yap core, executes request', async () => {
        const yap = new Yap({ typeDefs, resolvers });
        const request = getTestRequest();
        const awsContext = getTestAwsContext();
        request.body = query;
        request.httpMethod = 'POST';
        set(request, 'headers.Accept', 'application/json');
        const queryResult = await yap.handler(request as unknown as APIGatewayProxyEvent, awsContext);
        const payload = JSON.parse(queryResult.body).data.fields;
        assert.deepEqual(payload, result);
    });

    it('U-TEST-2 - Creates Yap core, executes request, handle exception', async () => {
        const connector = new TestErrorConnector();
        const errResolvers = {
            Query: { fields: connector.execute },
        };
        const yap = new Yap({ typeDefs, resolvers: errResolvers });
        const request = getTestRequest();
        const awsContext = getTestAwsContext();
        request.body = query;
        request.httpMethod = 'POST';
        set(request, 'headers.Accept', 'application/json');
        const queryResult = await yap.handler(request as unknown as APIGatewayProxyEvent, awsContext);
        const payload = JSON.parse(queryResult.body);
        assert.equal(get(payload, 'errors[0].message'), 'Some error');
        assert.deepEqual(get(payload, 'errors[0].locations'), [{ line: 1, column: 15 }]);
    });

    it("U-TEST-3 - Should load policy structure, and trigger validation", () => {
        const yap = new Yap({ typeDefs, resolvers });
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
        const spyValidate = sinon.spy(yap, 'validatePolicies');
        yap.loadPolicies(xml);
        assert.deepEqual(yap.policy, {
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

    it("U-TEST-4 - Should validate policy structure", () => {
        const yap = new Yap({ typeDefs, resolvers });
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
        const validationResult = yap.validatePolicies(parsedXML);
        assert.deepEqual(validationResult, []);
    });

    it("U-TEST-5 - Should validate policy structure with validation errors", () => {
        const yap = new Yap({ typeDefs, resolvers });
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
        const validationResult = yap.validatePolicies(parsedXML);
        assert.deepEqual(validationResult, [
            "policies-ERR-002: XML tag <policies/> must only contains <inbound />, <outbound />, <on-error /> XML Tag, found <inboundу>",
            "policies-ERR-003: XML tag <policies/> should contains at least one policy. Tag <outbound> have no elements",
            "policies-ERR-004: XML tag <on-error> contains unknown policy <unknown-policy>. Please, load definition for this policy before loading of XML",
            "check-header-ERR-001: attribute 'failed-check-error-message' is required",
            "check-header-ERR-002: attribute 'failed-check-httpcode' is required and should be integer",
            "check-header-ERR-003: attribute 'name' is required",
            "check-header-ERR-004: attribute 'ignore-case' is required, and should be either true or false"]);
    });

    it('U-TEST-6 - Test policies inbound', async () => {
        const yap = new Yap({ typeDefs, resolvers });
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.201.169";
        const context = getTestContext();
        context.request = request;
        yap.loadPolicies(`
        <policies>
            <inbound>
                <ip-filter action="allow">
                    <address>13.66.201.169</address>
                    <address-range from="13.66.140.128" to="13.66.255.143" />
                </ip-filter>
            </inbound>
        </policies>`);

        const spy = sinon.spy(policyManager, 'apply');
        await yap.applyPolicies(Scope.inbound, context);
        assert.equal(spy.callCount, 1);

        await yap.applyPolicies(Scope.inbound, context);
        assert.equal(spy.callCount, 2);
        spy.restore();
    });

    it('U-TEST-7 - Test policies inbound and outbound', async () => {
        const yap = new Yap({ typeDefs, resolvers });
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.140.129";
        const context = getTestContext();
        context.request = request;

        yap.loadPolicies(`
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

        const spy = sinon.spy(policyManager, 'apply');
        await yap.applyPolicies(Scope.inbound, context);
        await yap.applyPolicies(Scope.outbound, context);
        assert.equal(spy.callCount, 2);
        spy.restore();
    });

    it('U-TEST-8 - Test policies error', async () => {
        const yap = new Yap({ typeDefs, resolvers });
        const request = getTestRequest();
        request.requestContext.identity.sourceIp = "13.66.140.129";
        const context = getTestContext();
        context.request = request;
        yap.loadPolicies(`
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

        const spy = sinon.spy(policyManager, 'apply');
        await yap.applyPolicies(Scope.inbound, context);
        assert.equal(spy.callCount, 1);
        spy.restore();
    });

    it('U-TEST-9 - Should add custom policy, and execute', async () => {
        const customResponse = 'Custom-Response-Set';
        const customPolicy = {
            id: 'custom-policy',
            name: 'Custom',
            category: PolicyCategory.advanced,
            description: 'Does stuff',
            scopes: [Scope.outbound],
            apply: async (executionContext: ExecutionContext) => {
                set(executionContext, 'context.response.body', customResponse);
                return executionContext;
            },
            validate: () => [],
        };
        const policies = `
        <policies>
            <outbound>
                <custom-policy>
                </custom-policy>
            </outbound>
        </policies>`;
        const yap = new Yap({ typeDefs, resolvers, policies, customPolicies: [customPolicy] });
        const request = getTestRequest();
        const awsContext = getTestAwsContext();
        request.body = query;
        request.httpMethod = 'POST';
        set(request, 'headers.Accept', 'application/json');
        const queryResult = await yap.handler(request as unknown as APIGatewayProxyEvent, awsContext);
        const payload = queryResult.body;
        assert.deepEqual(payload, customResponse);
    });

    it('U-TEST-10 - Should add custom policy, and delete it', async () => {
        const customPolicy = {
            id: 'custom-policy',
            name: 'Custom',
            category: PolicyCategory.advanced,
            description: 'Does stuff',
            scopes: [Scope.outbound],
            apply: async (executionContext: ExecutionContext) => {
                throw new Error("Policy error");
            },
            validate: () => [],
        };
        const policies = `
        <policies>
            <outbound>
                <custom-policy>
                </custom-policy>
            </outbound>
        </policies>`;
        const yap = new Yap({ typeDefs, resolvers, policies, customPolicies: [customPolicy] });
        yap.deletePolicy('custom-policy');
        assert.equal(policyManager.getPolicy('custom-policy'), undefined);
        assert.equal(yap.policy[Scope.outbound].find((p) => p.id === 'custom-policy'), undefined);
    });

    it('U-TEST-11 - Should add custom policy, and handle exception', async () => {
        const customResponse = 'Custom-Response-Set';
        const customPolicy = {
            id: 'custom-policy',
            name: 'Custom',
            category: PolicyCategory.advanced,
            description: 'Does stuff',
            scopes: [Scope.outbound],
            apply: async (executionContext: ExecutionContext) => {
                set(executionContext, 'context.response.body', customResponse);
                return executionContext;
            },
            validate: () => [],
        };
        const policies = `
        <policies>
            <outbound>
                <custom-policy>
                </custom-policy>
            </outbound>
        </policies>`;
        const yap = new Yap({ typeDefs, resolvers, policies, customPolicies: [customPolicy] });
        const request = getTestRequest();
        const awsContext = getTestAwsContext();
        request.body = query;
        request.httpMethod = 'POST';
        set(request, 'headers.Accept', 'application/json');
        const queryResult = await yap.handler(request as unknown as APIGatewayProxyEvent, awsContext);
        const payload = queryResult.body;
        yap.deletePolicy('custom-policy');
        assert.deepEqual(payload, customResponse);
    });
});