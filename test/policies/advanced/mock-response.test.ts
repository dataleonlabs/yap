import assert from 'assert';
import { get, set } from 'lodash';
import { xml2js } from 'xml-js';
import { Scope } from '../../../src/policies';
import MockResponse from '../../../src/policies/advanced/mock-response';

describe('<mock-response />', () => {

  it('U-TEST-1 - Test set body, response, status code', async () => {
    const body = 'someBody';
    const res = xml2js(`<mock-response status-code='200' content-type='application/json' body="${body}"/>`);
    const mockResponse = new MockResponse();
    const context = {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    };
    const resIp = await mockResponse.apply({ policyElement: res.elements[0], context, scope: Scope.inbound });
    assert.equal(get(resIp, 'context.response.headers.content-type'), 'application/json');
    assert.equal(get(resIp, 'context.response.statusCode'), '200');
    assert.equal(get(resIp, 'context.response.body'), body);
  });

  it('U-TEST-2 - Should not update respose, status code and body, if they are not set in a policy', async () => {
    const oldCType = 'application/random';
    const oldStatusCode = 212;
    const oldBody = 'someOldBody';
    const res = xml2js(`<mock-response someRandomAttribute="randomVal"/>`);
    const mockResponse = new MockResponse();
    const context = {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    };
    set(context, 'response.headers.content-type', oldCType);
    set(context, 'response.statusCode', oldStatusCode);
    set(context, 'response.body', oldBody);
    const resIp = await mockResponse.apply({ policyElement: res.elements[0], context, scope: Scope.inbound });
    assert.equal(get(resIp, 'context.response.headers.content-type'), oldCType);
    assert.equal(get(resIp, 'context.response.statusCode'), oldStatusCode);
    assert.equal(get(resIp, 'context.response.body'), oldBody);
  });

  it('U-TEST-3 - Should validate policy', async () => {
    const res = xml2js(`<mock-response status-code='200' content-type='application/json' body="88888"/>`);
    const mockResponse = new MockResponse();
    const validationResult = mockResponse.validate(res.elements[0]);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-4 - Should validate policy, with errors', async () => {
    const res = xml2js(`<mock-response status-code='notANumber'/>`);
    const mockResponse = new MockResponse();
    const validationResult = mockResponse.validate(res.elements[0]);
    assert.deepEqual(validationResult, ["mock-response-ERR-001: attribute 'status-code' should persist and be a number. Example status-code='200'"]);
  });
});
