import assert from 'assert';
import { get } from 'lodash';
import CheckHTTPHeader from '../../../src/policies/access-restriction/check-http-header';
import { getTestRequest } from '../../tools';

describe('<check-http-header />', () => {

    const unauthorizedCode = 401;
    const unauthorizedMessage = "unauthorized";
    const requiredHeaderName = 'requiredHeaderName';
    const requiredHeaderValue = 'requiredHeaderValue';
    const wrongHeaderName = 'wrongHeaderName';

    it("U-TEST-1 Shoud pass correct header", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            requiredHeaderName: requiredHeaderValue,
        };
        const context = {
            request,
            response: {}, fields: {}, connection: {},
        };
        const policy = {
            type: "element",
            name: "check-header",
            attributes:
            {
                "name": requiredHeaderName,
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
                "ignore-case": "false",
            },
            elements: [{
                type: "element",
                name: "value",
                elements: [
                    { type: "text", text: "headerValue1" }],
            },
            {
                type: "element",
                name: "value",
                elements:
                    [{ type: "text", text: requiredHeaderValue }],
            }],
        };
        const appliedResult = await checkHTTPHeader.apply({ policyElement: policy, context, scope: 'inbound' });
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-2 Shoud pass correct header ignoreCase = true", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            requiredHeaderName: requiredHeaderValue.toUpperCase(),
        };
        const context = {
            request,
            response: {}, fields: {}, connection: {},
        };
        const policy = {
            type: "element",
            name: "check-header",
            attributes:
            {
                "name": requiredHeaderName,
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
                "ignore-case": "true",
            },
            elements: [{
                type: "element",
                name: "value",
                elements: [
                    { type: "text", text: "headerValue1" }],
            },
            {
                type: "element",
                name: "value",
                elements:
                    [{ type: "text", text: requiredHeaderValue }],
            }],
        };
        const appliedResult = await checkHTTPHeader.apply({ policyElement: policy, context, scope: 'inbound' });
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-3 Shoud reject if no headers defined in policy", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            requiredHeaderName: requiredHeaderValue.toUpperCase() + '1',
        };
        const context = {
            request,
            response: {}, fields: {}, connection: {},
        };
        const policy = {
            type: "element",
            name: "check-header",
            attributes:
            {
                "name": requiredHeaderName,
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
                "ignore-case": "true",
            },
            elements: [],
        };
        const appliedResult = await checkHTTPHeader.apply({ policyElement: policy, context, scope: 'inbound' });
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-4 Should reject incorrect header with ignore-case false custom code and message", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            requiredHeaderName: requiredHeaderValue.toUpperCase(),
        };
        const context = {
            request,
            response: {}, fields: {}, connection: {},
        };
        const policy = {
            type: "element",
            name: "check-header",
            attributes:
            {
                "name": requiredHeaderName,
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
                "ignore-case": "false",
            },
            elements: [{
                type: "element",
                name: "value",
                elements: [
                    { type: "text", text: "headerValue1" }],
            },
            {
                type: "element",
                name: "value",
                elements:
                    [{ type: "text", text: requiredHeaderValue }],
            }],
        };
        const appliedResult = await checkHTTPHeader.apply({ policyElement: policy, context, scope: 'inbound' });
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-5 Should reject incorrect header with custom code and message", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            requiredHeaderName: requiredHeaderValue + '1',
        };
        const context = {
            request,
            response: {}, fields: {}, connection: {},
        };
        const policy = {
            type: "element",
            name: "check-header",
            attributes:
            {
                "name": requiredHeaderName,
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
                "ignore-case": "true",
            },
            elements: [{
                type: "element",
                name: "value",
                elements: [
                    { type: "text", text: "headerValue1" }],
            },
            {
                type: "element",
                name: "value",
                elements:
                    [{ type: "text", text: requiredHeaderValue }],
            }],
        };
        const appliedResult = await checkHTTPHeader.apply({ policyElement: policy, context, scope: 'inbound' });
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-6 Should reject if header not in list", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            wrongHeaderName: requiredHeaderValue,
        };
        const context = {
            request,
            response: {}, fields: {}, connection: {},
        };
        const policy = {
            type: "element",
            name: "check-header",
            attributes:
            {
                "name": requiredHeaderName,
                "failed-check-httpcode": unauthorizedCode,
                "failed-check-error-message": unauthorizedMessage,
                "ignore-case": "true",
            },
            elements: [{
                type: "element",
                name: "value",
                elements: [
                    { type: "text", text: "headerValue1" }],
            },
            {
                type: "element",
                name: "value",
                elements:
                    [{ type: "text", text: requiredHeaderValue }],
            }],
        };
        const appliedResult = await checkHTTPHeader.apply({ policyElement: policy, context, scope: 'inbound' });
        assert.equal(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.equal(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });
});