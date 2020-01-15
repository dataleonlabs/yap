import assert from 'assert';
import { get } from 'lodash';
import CheckHTTPHeader from '../../../src/policies/accessRestriction/CheckHttpHeader';
import { Scope } from '../../../src/policies/policy';
import { getTestRequest } from '../../tools';
import assertThrowsAsync from 'assert-throws-async';

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
            response: {}, variables: {}, connection: {},
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
        const appliedResult = await checkHTTPHeader.apply({ policyElement: policy, context, scope: Scope.inbound });
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
            response: {}, variables: {}, connection: {},
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
        const appliedResult = await checkHTTPHeader.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.notEqual(get(appliedResult, 'context.response.statusCode'), unauthorizedCode);
        assert.notEqual(get(appliedResult, 'context.response.body'), unauthorizedMessage);
    });

    it("U-TEST-3 Should reject if no headers defined in policy", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            requiredHeaderName: requiredHeaderValue.toUpperCase() + '1',
        };
        const context = {
            request,
            response: {}, variables: {}, connection: {},
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
        await assertThrowsAsync(() => checkHTTPHeader.apply({ policyElement: policy, context, scope: Scope.inbound }), Error)
        assert.equal(get(context, 'response.statusCode'), unauthorizedCode);
        assert.equal(get(context, 'response.body'), unauthorizedMessage);
    });

    it("U-TEST-4 Should reject incorrect header with ignore-case false custom code and message", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            requiredHeaderName: requiredHeaderValue.toUpperCase(),
        };
        const context = {
            request,
            response: {}, variables: {}, connection: {},
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
        await assertThrowsAsync(() => checkHTTPHeader.apply({ policyElement: policy, context, scope: Scope.inbound }), Error)
        assert.equal(get(context, 'response.statusCode'), unauthorizedCode);
        assert.equal(get(context, 'response.body'), unauthorizedMessage);
    });

    it("U-TEST-5 Should reject incorrect header with custom code and message", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            requiredHeaderName: requiredHeaderValue + '1',
        };
        const context = {
            request,
            response: {}, variables: {}, connection: {},
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
        await assertThrowsAsync(() => checkHTTPHeader.apply({ policyElement: policy, context, scope: Scope.inbound }), Error)
        assert.equal(get(context, 'response.statusCode'), unauthorizedCode);
        assert.equal(get(context, 'response.body'), unauthorizedMessage);
    });

    it("U-TEST-6 Should reject if header not in list", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const request = getTestRequest();
        request.requestContext.headers = {
            wrongHeaderName: requiredHeaderValue,
        };
        const context = {
            request,
            response: {}, variables: {}, connection: {},
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
        await assertThrowsAsync(() => checkHTTPHeader.apply({ policyElement: policy, context, scope: Scope.inbound }), Error)
        assert.equal(get(context, 'response.statusCode'), unauthorizedCode);
        assert.equal(get(context, 'response.body'), unauthorizedMessage);
    });

    it("U-TEST-7 Should pass validation", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
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
        const validationResult = checkHTTPHeader.validate(policy);
        assert.deepEqual(validationResult, []);
    });

    it("U-TEST-8 Should get validation errors", async () => {
        const checkHTTPHeader = new CheckHTTPHeader();
        const policy = {
            type: "element",
            name: "check-header",
        };
        const validationResult = checkHTTPHeader.validate(policy);
        assert.deepEqual(validationResult,
            ["check-header-ERR-001: attribute 'failed-check-error-message' is required",
            "check-header-ERR-002: attribute 'failed-check-httpcode' is required and should be integer",
            "check-header-ERR-003: attribute 'name' is required",
            "check-header-ERR-004: attribute 'ignore-case' is required, and should be either true or false"]);
    });
});