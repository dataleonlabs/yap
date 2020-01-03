import assert from 'assert';
import { get } from 'lodash';
import { Scope } from '../../../src/policies/policy';
import XMLtoJSON from '../../../src/policies/transformation/xml-to-json';
import { getTestContext } from '../../tools';

const testConvertedFriendlyBody = {
    root: {
        address: {
            city: {
                _text: "Chicago",
            },
            date: {
                _text: "11-12-2018 not valid date",
            },
            state: {
                _text: "Illinois",
            },
            streetAddress: {
                _text: "3212 22nd St",
            },
            zip: {
                _text: "10000",
            },
        },
        date: {
            _text: "2016-05-24T15:54:14.876Z",
        },
        email: {
            _text: "john@smith.com",
        },
        firstName: {
            _text: "John",
        },
        lastName: {
            _text: "Smith",
        },
    },
};

const testConvertedBody = {
    elements: [
        {
            type: "element", name: "root", elements:
                [{
                    type: "element", name: "firstName", elements:
                        [{ type: "text", text: "John" }],
                },
                {
                    type: "element", name: "lastName", elements:
                        [{ type: "text", text: "Smith" }],
                },
                {
                    type: "element", name: "date", elements:
                        [{ type: "text", text: "2016-05-24T15:54:14.876Z" }],
                },
                {
                    type: "element", name: "address", elements:
                        [{
                            type: "element", name: "streetAddress", elements:
                                [{ type: "text", text: "3212 22nd St" }],
                        },
                        {
                            type: "element", name: "city", elements:
                                [{ type: "text", text: "Chicago" }],
                        },
                        {
                            type: "element", name: "state", elements:
                                [{ type: "text", text: "Illinois" }],
                        },
                        {
                            type: "element", name: "zip", elements:
                                [{ type: "text", text: "10000" }],
                        },
                        {
                            type: "element", name: "date", elements:
                                [{ type: "text", text: "11-12-2018 not valid date" }],
                        }],
                },
                {
                    type: "element", name: "email", elements:
                        [{ type: "text", text: "john@smith.com" }],
                }],
        }],
};

const testBody = `<root><firstName>John</firstName>
<lastName>Smith</lastName>
<date>2016-05-24T15:54:14.876Z</date>
<address>
    <streetAddress>3212 22nd St</streetAddress>
    <city>Chicago</city>
    <state>Illinois</state>
    <zip>10000</zip>
    <date>11-12-2018 not valid date</date>
</address>
<email>john@smith.com</email></root>`;

describe("<xml-to-json />", async () => {
    it("U-TEST-1 Convert direct", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                kind: "direct",
                apply: "always",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const context = getTestContext();
        context.request.body = testBody;
        const appliedResult = await xmlToJson.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.equal(get(appliedResult, 'context.request.requestContext.headers.Accept'), 'application/json');
        assert.deepEqual(appliedResult.context.request.body, testConvertedBody);
    });

    it("U-TEST-2 Convert javascript-friendly", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                kind: "javascript-friendly",
                apply: "always",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const context = getTestContext();
        context.request.body = testBody;
        const appliedResult = await xmlToJson.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.equal(get(appliedResult, 'context.request.requestContext.headers.Accept'), 'application/json');
        assert.deepEqual(appliedResult.context.request.body, testConvertedFriendlyBody);
    });

    it("U-TEST-3 Convert outbound", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                kind: "direct",
                apply: "always",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const context = getTestContext();
        context.response.body = testBody;
        const appliedResult = await xmlToJson.apply({ policyElement: policy, context, scope: Scope.outbound });
        assert.deepEqual(appliedResult.context.response.body, testConvertedBody);
        assert.equal(get(appliedResult, 'context.response.headers.Content-Type'), 'application/json');
    });

    it("U-TEST-4 Convert apply=content-type-json, content-type-xml header persist", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                kind: "direct",
                apply: "content-type-xml",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const context = getTestContext();
        context.response.body = testBody;
        context.response.headers = {
            'Content-Type': 'application/xml',
        };
        const appliedResult = await xmlToJson.apply({ policyElement: policy, context, scope: Scope.outbound });
        assert.deepEqual(appliedResult.context.response.body, testConvertedBody);
        assert.equal(get(appliedResult, 'context.response.headers.Content-Type'), 'application/json');
    });

    it("U-TEST-5 Do not Convert apply=content-type-json, content-type-xml header not persist", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                kind: "direct",
                apply: "content-type-xml",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const context = getTestContext();
        context.response.body = testBody;
        context.response.headers = {
            'Content-Type': 'application/json',
        };
        const appliedResult = await xmlToJson.apply({ policyElement: policy, context, scope: Scope.outbound });
        assert.deepEqual(appliedResult.context.response.body, testBody);
    });

    it("U-TEST-6 Convert consider-accept-header=true, Accept header persist", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                "kind": "direct",
                "consider-accept-header": "true",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const context = getTestContext();
        context.request.body = testBody;
        context.request.requestContext.headers = {
            Accept: 'application/xml',
        };
        const appliedResult = await xmlToJson.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.equal(get(appliedResult, 'context.request.requestContext.headers.Accept'), 'application/json');
        assert.deepEqual(appliedResult.context.request.body, testConvertedBody);
    });

    it("U-TEST-7 Do not convert consider-accept-header=true, Accept header not persist", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                "kind": "direct",
                "consider-accept-header": "true",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const context = getTestContext();
        context.request.body = testBody;
        context.request.requestContext.headers = {
            Accept: 'application/json',
        };
        const appliedResult = await xmlToJson.apply({ policyElement: policy, context, scope: Scope.inbound });
        assert.deepEqual(appliedResult.context.request.body, testBody);
    });

    it("U-TEST-8 Should validate policy", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                kind: "direct",
                apply: "content-type-xml",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const validationResult = xmlToJson.validate(policy);
        assert.deepEqual(validationResult, []);
    });

    it("U-TEST-9 Should validate policy, with errors", async () => {
        const policy = {
            type: "element",
            name: "xml-to-json",
            attributes:
            {
                kind: "directy",
                apply: "content-type-xml-json",
            },
        };
        const xmlToJson = new XMLtoJSON();
        const validationResult = xmlToJson.validate(policy);
        assert.deepEqual(validationResult, [
            "xml-to-json-ERR-001: attribute 'apply' is required and should be one of 'always', 'content-type-xml'",
            "xml-to-json-ERR-002: attribute 'kind' is required and should be one of 'direct', 'javascript-friendly'",
        ]);
    });
});