import assert from 'assert';
import { get } from 'lodash';
import ApiKey from '../../../src/policies/authentification/api-key';
import { Scope } from '../../../src/policies/policy';
import { getTestRequest } from '../../tools';

const unauthorizedCode = 401;
const unauthorizedMessage = "unauthorized";
const allowedKey = "someAllowedKey";
describe("<api-key />", () => {
    it("U-TEST-1 Should pass if api key in list", async () => {
        const apiKey = new ApiKey();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'api-key': allowedKey,
        };
        const policy = {
            type: "element",
            name: "api-key",
            attributes:
            {
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
            },
            elements:
                [{
                    type: "element", name: "value", elements:
                        [{ type: "text", text: allowedKey }],
                },
                {
                    type: "element", name: "value", elements:
                        [{ type: "text", text: "someKey" }],
                }],
        };
        const appliedResult = await apiKey.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-2 Should not pass if api key not in list", async () => {
        const apiKey = new ApiKey();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'api-key': allowedKey + '1',
        };
        const policy = {
            type: "element",
            name: "api-key",
            attributes:
            {
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
            },
            elements:
                [{
                    type: "element", name: "value", elements:
                        [{ type: "text", text: allowedKey }],
                },
                {
                    type: "element", name: "value", elements:
                        [{ type: "text", text: "someKey" }],
                }],
        };
        const appliedResult = await apiKey.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-3 Should not pass if no key sent", async () => {
        const apiKey = new ApiKey();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {

        };
        const policy = {
            type: "element",
            name: "api-key",
            attributes:
            {
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
            },
            elements:
                [{
                    type: "element", name: "value", elements:
                        [{ type: "text", text: allowedKey }],
                },
                {
                    type: "element", name: "value", elements:
                        [{ type: "text", text: "someKey" }],
                }],
        };
        const appliedResult = await apiKey.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-3 Should not pass if api key sent but list is empty", async () => {
        const apiKey = new ApiKey();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'api-key': allowedKey,
        };
        const policy = {
            type: "element",
            name: "api-key",
            attributes:
            {
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
            },
            elements:
                [],
        };
        const appliedResult = await apiKey.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-4 Should validate policy", async () => {
        const policy = {
            type: "element",
            name: "api-key",
            attributes:
            {
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
            },
            elements:
                [{
                    type: "element", name: "value", elements:
                        [{ type: "text", text: "someKey" }],
                }],
        };
        const apiKey = new ApiKey();
        const validationResult = apiKey.validate(policy);
        assert.deepEqual(validationResult, []);
    });

    it("U-TEST-5 Should validate policy, with errors", async () => {
        const policy = {
            type: "element",
            name: "api-key",
            attributes:
            {

            },
            elements:
                [],
        };
        const apiKey = new ApiKey();
        const validationResult = apiKey.validate(policy);
        assert.deepEqual(validationResult, [
            "api-key-ERR-001: attribute 'failed-check-error-message' is required",
            "api-key-ERR-002: attribute 'failed-check-httpcode' is required and should be integer",
            "api-key-ERR-003: at least one api-key should be defined for policy",
        ]);
    });
});