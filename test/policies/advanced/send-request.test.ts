import assert from 'assert';
import * as axios from 'axios';
import { cloneDeep, get, unset } from 'lodash';
import * as sinon from 'sinon';
import SendRequest from '../../../src/policies/advanced/send-request';
import { Scope } from '../../../src/policies/policy';
import { getTestContext } from '../../tools';

describe("<send-request/>", () => {

    const customVariableName = "customVariableName";
    const someToken = "someToken";

    const policyProto: any = {
        type: "element",
        name: "send-request",
        attributes:
        {
            "mode": "copy",
            "response-variable-name": customVariableName,
            "timeout": "20",
            "ignore-error": "false",
        },
        elements:
            [{
                type: "element",
                name: "set-method",
                elements: [{ type: "text", text: "POST" }],
            },
            {
                type: "element",
                name: "set-url",
                elements:
                    [{ type: "text", text: "https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection" }],
            },
            {
                type: "element", name: "set-header", attributes: { "name": "Authorization", "exists-action": "override" },
                elements: [{
                    type: "element", name: "value",
                    elements: [{ type: "text", text: "basic dXNlcm5hbWU6cGFzc3dvcmQ=" }],
                }],
            },
            {
                type: "element", name: "set-header", attributes:
                    { "name": "Content-Type", "exists-action": "override" },
                elements: [{
                    type: "element", name: "value", elements:
                        [{ type: "text", text: "application/x-www-form-urlencoded" }],
                }],
            },
            {
                type: "element", name: "set-body", elements:
                    [{ type: "text", text: someToken }],
            }],
    };

    it("U-TEST-1 - Sends request correctly", async () => {
        const policy = cloneDeep(policyProto);
        const context = getTestContext();
        const respBody = {
            some: "response",
        };
        const stub = sinon.stub(axios.default, 'request' as any).returns(new Promise((res) => res({ data: respBody })));
        const sendRequest = new SendRequest();
        const appliedResult = await sendRequest.apply({ policyElement: policy, context, scope: Scope.inbound });
        stub.restore();
        assert.deepEqual(stub.getCall(0).args[0], {
            url:
                'https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection',
            method: 'POST',
            headers:
            {
                "Authorization": 'basic dXNlcm5hbWU6cGFzc3dvcmQ=',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: someToken,
            timeout: 20,
        });
        assert.deepEqual(get(appliedResult, `context.variables[${customVariableName}]`), respBody);
    });

    it("U-TEST-2 - receives response-variable-name as null if ignore-error='true' and error happened", async () => {
        const policy = cloneDeep(policyProto);
        policy.attributes["ignore-error"] = "true";
        const context = getTestContext();
        const respBody = {
            some: "response",
        };
        const stub = sinon.stub(axios.default, 'request' as any).returns(new Promise((res, rej) => rej({ data: respBody })));
        const sendRequest = new SendRequest();
        const appliedResult = await sendRequest.apply({ policyElement: policy, context, scope: Scope.inbound });
        stub.restore();
        assert.deepEqual(stub.getCall(0).args[0], {
            url:
                'https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection',
            method: 'POST',
            headers:
            {
                "Authorization": 'basic dXNlcm5hbWU6cGFzc3dvcmQ=',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: someToken,
            timeout: 20,
        });
        assert.strictEqual(get(appliedResult, `context.variables[${customVariableName}]`), null);
    });

    it("U-TEST-3 - receives response-variable-name as undefined if ignore-error='true' and error happened", async () => {
        const policy = cloneDeep(policyProto);
        policy.attributes["ignore-error"] = "true";
        delete policy.attributes["response-variable-name"];
        const context = getTestContext();
        const respBody = {
            some: "response",
        };
        const stub = sinon.stub(axios.default, 'request' as any).returns(new Promise((res, rej) => rej({ data: respBody })));
        const sendRequest = new SendRequest();
        const appliedResult = await sendRequest.apply({ policyElement: policy, context, scope: Scope.inbound });
        stub.restore();
        assert.deepEqual(stub.getCall(0).args[0], {
            url:
                'https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection',
            method: 'POST',
            headers:
            {
                "Authorization": 'basic dXNlcm5hbWU6cGFzc3dvcmQ=',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: someToken,
            timeout: 20,
        });
        assert.strictEqual(get(appliedResult, `context.variables[${customVariableName}]`), undefined);
    });

    it("U-TEST-4 - Do not copy existing context, if mode='new'", async () => {
        const policy = cloneDeep(policyProto);
        const context = getTestContext();
        context.request.httpMethod = 'PUT';
        policy.attributes["response-variable-name"] = customVariableName;
        policy.elements.splice(0, 1);
        const respBody = {
            some: "response",
        };
        policy.attributes.mode = "new";
        const stub = sinon.stub(axios.default, 'request' as any).returns(new Promise((res) => res({ data: respBody })));
        const sendRequest = new SendRequest();
        const appliedResult = await sendRequest.apply({ policyElement: policy, context, scope: Scope.inbound });
        stub.restore();
        assert.deepEqual(stub.getCall(0).args[0], {
            url:
                'https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection',
            method: 'GET',
            headers:
            {
                "Authorization": 'basic dXNlcm5hbWU6cGFzc3dvcmQ=',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: someToken,
            timeout: 20,
        });
        assert.deepEqual(get(appliedResult, `context.variables[${customVariableName}]`), respBody);
    });

    it("U-TEST-5 - Should validate policy", async () => {
        const sendRequest = new SendRequest();
        const validationResult = sendRequest.validate(policyProto);
        assert.deepEqual(validationResult, []);
    });

    it("U-TEST-6 - Should validate policy, with errors", async () => {
        const sendRequest = new SendRequest();
        const policy = cloneDeep(policyProto);
        policy.attributes.mode = 'new';
        policy.elements.splice(0, 2);
        policy.elements.push({ name: "wrong-policy" });
        unset(policy, 'attributes.response-variable-name');
        const validationResult = sendRequest.validate(policy);
        assert.deepEqual(validationResult, [
            "send-request-ERR-001: response-variable-name attribute should be set",
            "send-request-ERR-005: policy <wrong-policy> not allowed here. Allowed only <set-url>, <set-method>, <set-header>, <set-body>",
            "send-request-ERR-003: Should contain XML tag <set-url> if mode is new",
            "send-request-ERR-004: Should contain XML tag <set-method> if mode is new",
        ]);
    });

});