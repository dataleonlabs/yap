import assert from 'assert';
import { get } from 'lodash';
import { Scope } from '../../../src/policies/policy';
import JSONtoXML from '../../../src/policies/transformation/json-to-xml';
import { getTestContext } from '../../tools';

describe('<json-to-xml />', () => {

  const testBody = {
    firstName: "John",
    lastName: "Smith",
    date: '2016-05-24T15:54:14.876Z',
    address: {
      streetAddress: "3212 22nd St",
      city: "Chicago",
      state: "Illinois",
      zip: 10000,
      date: '11-12-2018 not valid date',
    },
    email: "john@smith.com",
  };

  const testConvertedBody = `<firstName>John</firstName>
<lastName>Smith</lastName>
<date>2016-05-24T15:54:14.876Z</date>
<address>
    <streetAddress>3212 22nd St</streetAddress>
    <city>Chicago</city>
    <state>Illinois</state>
    <zip>10000</zip>
    <date>11-12-2018 not valid date</date>
</address>
<email>john@smith.com</email>`;

  it('U-TEST-1 - Test json to xml success inbound', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "apply": "always",
        "parse-date": "false",
      },
    };
    const context = getTestContext();
    context.request.body = testBody;
    const appliedResult = await jsonToXml.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.equal(get(appliedResult, 'context.request.requestContext.headers.Accept'), 'application/xml');
    assert.equal(appliedResult.context.request.body, testConvertedBody);
  });

  it('U-TEST-2 - Test json to xml success outbound', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "apply": "always",
        "parse-date": "false",
      },
    };
    const context = getTestContext();
    context.response.body = testBody;
    const appliedResult = await jsonToXml.apply({ policyElement: policy, context, scope: Scope.outbound });
    assert.equal(get(appliedResult, 'context.response.headers.Content-Type'), 'application/xml');
    assert.equal(appliedResult.context.response.body, testConvertedBody);
  });

  it('U-TEST-3 - Test json to xml success on-erroe', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "apply": "always",
        "parse-date": "false",
      },
    };
    const context = {
      request: {},
      response: { body: {} }, fields: {}, connection: {},
    };
    context.response.body = testBody;
    const appliedResult = await jsonToXml.apply({ policyElement: policy, context, scope: Scope.onerror });
    assert.equal(appliedResult.context.response.body, testConvertedBody);
  });

  it('U-TEST-4 - Convert inbound if apply=content-type-json and header exists', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "apply": "content-type-json",
        "parse-date": "false",
      },
    };
    const context = getTestContext();
    context.request.body = testBody;
    context.response.headers = {
      'Content-Type': 'application/json',
    };
    const appliedResult = await jsonToXml.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.equal(appliedResult.context.request.body, testConvertedBody);
  });

  it('U-TEST-5 - Do not Convert if apply=content-type-json and response header not exists', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "parse-date": "false",
        "apply": "content-type-json",
      },
    };
    const context = getTestContext();
    context.request.body = testBody;
    const appliedResult = await jsonToXml.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.equal(appliedResult.context.request.body, testBody);
  });

  it('U-TEST-6 - Convert if consider-accept-header=true and request header exists', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "consider-accept-header": "true",
        "parse-date": "false",
      },
    };
    const context = getTestContext();
    context.request.body = testBody;
    context.request.requestContext.headers = {
      Accept: 'application/json',
    };
    const appliedResult = await jsonToXml.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.equal(appliedResult.context.request.body, testConvertedBody);
  });

  it('U-TEST-7 - No not Convert if consider-accept-header=false and request header exists', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "consider-accept-header": "false",
        "parse-date": "false",
      },
    };
    const context = getTestContext();
    context.request.body = testBody;
    context.request.requestContext.headers = {
      Accept: 'application/json',
    };
    const appliedResult = await jsonToXml.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.equal(appliedResult.context.request.body, testBody);
  });

  it('U-TEST-8 - Should validate policies', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "parse-date": "false",
        "apply": "content-type-json",
      },
    };
    const validationResult = jsonToXml.validate(policy);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-8 - Should validate policies, with error', async () => {
    const jsonToXml = new JSONtoXML();
    const policy = {
      type: "element",
      name: "json-to-xml",
      attributes:
      {
        "parse-date": "false",
        "apply": "content-type-wow-wronk",
      },
    };
    const validationResult = jsonToXml.validate(policy);
    assert.deepEqual(validationResult, [
      "json-to-xml-ERR-001: attribute 'apply' is required and should be one of 'always', 'content-type-json '",
    ]);
  });
});