import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import policyManager from '../../../src/policies';
import SetMethod from '../../../src/policies/advanced/SetMethod';
import { Scope } from '../../../src/policies/policy';

describe('<set-method />', () => {

  it('U-TEST-1 - Test set request method', async () => {
    const setMethod = new SetMethod();
    const res = xml2js(`
            <set-method>POST</set-method>
            `);
    const resIp = await setMethod.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, variables: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.httpMethod'), "POST");
  });

  it('U-TEST-2 - Should validate policy', async () => {
    const policyElement = xml2js(`
      <set-method>POST</set-method>
      `).elements[0];
    const setMethod = new SetMethod();
    const validationResult = setMethod.validate(policyElement);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-3 - Should validate policy, with errors', async () => {
    const policyElement = xml2js(`
      <set-method>NONEXISTENTMETHOD</set-method>
      `).elements[0];
    const setMethod = new SetMethod();
    const validationResult = setMethod.validate(policyElement);
    assert.deepEqual(validationResult, [
      "set-method-ERR-001: method name should be set and equals one of 'GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE. Example <set-method>POST</set-method>",
    ]);
  });
});