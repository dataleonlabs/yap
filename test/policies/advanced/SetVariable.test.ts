import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import SetVariable from '../../../src/policies/advanced/SetVariable';
import { Scope } from '../../../src';

describe('<set-variable />', () => {

  it('U-TEST-1 - Test variable', async () => {
    const res = xml2js(`
            <set-variable name="username" value="Jhon" />
            `);
    const setVariable = new SetVariable();
    const resIp = await setVariable.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, variables: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.variables.username'), "Jhon");
  });

  it('U-TEST-2 - Should validate policy', async () => {
    const res = xml2js(`
            <set-variable name="username" value="Jhon" />
            `).elements[0];
    const setVariable = new SetVariable();
    const validationResult = setVariable.validate(res);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-3 - Should validate policy', async () => {
    const res = xml2js(`
            <set-variable />
            `).elements[0];
    const setVariable = new SetVariable();
    const validationResult = setVariable.validate(res);
    assert.deepEqual(validationResult, [
      "set-variable-ERR-001: value should be set in attributes, for example value=\"true\"",
      "set-variable-ERR-002: name should be set in attributes, for example name=\"isBackend\"",
    ]);
  });
});