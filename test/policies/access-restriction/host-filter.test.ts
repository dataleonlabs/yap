import assert from 'assert';
import { get } from 'lodash';
import { Scope } from '../../../src/policies';
import HostFilter from "../../../src/policies/access-restriction/host-filter";
import { getTestRequest } from '../../tools';

const allowedHost = "allowedHost";
const deniedHost = "deniedHost";
const unauthorizedCode = 401;
const unauthorizedMessage = "unauthorized";

describe("<host-filter />", () => {
    it("U-TEST-1 Should pass if host is in allow list", async () => {
        const hostFilter = new HostFilter();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'x-forwarded-host': allowedHost,
        };
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "allow",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [{
                    type: "element", name: "host", elements:
                        [{ type: "text", text: "superhost" }],
                },
                {
                    type: "element", name: "host", elements:
                        [{ type: "text", text: allowedHost }],
                }],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:Scope.inbound});
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-2 Should not pass if host is in not allow list", async () => {
        const hostFilter = new HostFilter();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'x-forwarded-host': allowedHost,
        };
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "allow",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [{
                    type: "element", name: "host", elements:
                        [{ type: "text", text: "superhost" }],
                },
                {
                    type: "element", name: "host", elements:
                        [{ type: "text", text: allowedHost + '1' }],
                }],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:Scope.inbound});
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-3 Should not pass if host in forbid list", async () => {
        const hostFilter = new HostFilter();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'x-forwarded-host': deniedHost,
        };
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "forbid",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [{
                    type: "element", name: "host", elements:
                        [{ type: "text", text: "superhost" }],
                },
                {
                    type: "element", name: "host", elements:
                        [{ type: "text", text: deniedHost }],
                }],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:Scope.inbound});
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-4 Should pass if host in not in forbid list", async () => {
        const hostFilter = new HostFilter();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'x-forwarded-host': deniedHost,
        };
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "forbid",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [{
                    type: "element", name: "host", elements:
                        [{ type: "text", text: "superhost" }],
                },
                {
                    type: "element", name: "host", elements:
                        [{ type: "text", text: deniedHost + '1' }],
                }],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:Scope.inbound});
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-5 Should not pass if allow list empty", async () => {
        const hostFilter = new HostFilter();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'x-forwarded-host': deniedHost,
        };
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "allow",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:Scope.inbound});
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-6 Should pass if forbid list empty", async () => {
        const hostFilter = new HostFilter();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {
            'x-forwarded-host': deniedHost,
        };
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "forbid",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:Scope.inbound});
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-7 Should not pass if no any header in request", async () => {
        const hostFilter = new HostFilter();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {

        };
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "allow",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [{
                    type: "element", name: "host", elements:
                        [{ type: "text", text: "superhost" }],
                },
                {
                    type: "element", name: "host", elements:
                        [{ type: "text", text: allowedHost }],
                }],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:Scope.inbound});
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-8 Should pass if forbid and no header sent", async () => {
        const hostFilter = new HostFilter();
        const context = {
            request: getTestRequest(),
            response: {}, fields: {}, connection: {},
        };
        context.request.requestContext.headers = {

        };
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "forbid",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [{
                    type: "element", name: "host", elements:
                        [{ type: "text", text: "superhost" }],
                },
                {
                    type: "element", name: "host", elements:
                        [{ type: "text", text: deniedHost + '1' }],
                }],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:Scope.inbound});
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-9 Should validate policy", async () => {
        const hostFilter = new HostFilter();
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {
                    "action": "forbid",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [{
                    type: "element", name: "host", elements:
                        [{ type: "text", text: "superhost" }],
                },
                {
                    type: "element", name: "host", elements:
                        [{ type: "text", text: deniedHost + '1' }],
                }],
        };
        const validationResult = hostFilter.validate(policy);
        assert.deepEqual(validationResult, []);
    });

    it("U-TEST-9 Should validate policy, and show errors", async () => {
        const hostFilter = new HostFilter();
        const policy = {
            type: "element",
            name: "host-filter",
            attributes:
                {},
            elements:
                [{
                    type: "element", name: "host", elements:
                        [],
                },
                {
                    type: "element", name: "host", elements:
                        [{ type: "text", text: deniedHost + '1' }],
                }],
        };
        const validationResult = hostFilter.validate(policy);
        assert.deepEqual(validationResult, [
            "host-filter-ERR-001: attribute 'failed-check-error-message' is required",
            "host-filter-ERR-002: attribute 'failed-check-httpcode' is required and should be integer",
            "host-filter-ERR-003: attribute 'action' is required, or should be either allow or forbid",
        ]);
    });
});