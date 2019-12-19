import assert from 'assert';
import { get } from 'lodash';
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
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope: 'inbound'});
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
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope: 'inbound'});
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-3 Should not pass if host in deny list", async () => {
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
                    "action": "deny",
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
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope: 'inbound'});
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-4 Should pass if host in not in deny list", async () => {
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
                    "action": "deny",
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
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope: 'inbound'});
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
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope: 'inbound'});
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-6 Should pass if deny list empty", async () => {
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
                    "action": "deny",
                    "failed-check-httpcode": unauthorizedCode,
                    "failed-check-error-message": unauthorizedMessage,
                },
            elements:
                [],
        };
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope: 'inbound'});
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
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope:'inbound'});
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-8 Should pass if deny and no header sent", async () => {
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
                    "action": "deny",
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
        const appliedResult = await hostFilter.apply({ policyElement: policy, context, scope: 'inbound'});
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });
});