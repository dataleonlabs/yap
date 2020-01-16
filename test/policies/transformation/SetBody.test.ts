import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import { Scope } from '../../../src';
import SetBody from '../../../src/policies/transformation/SetBody';

describe('<set-body />', () => {

  it('U-TEST-1 - Test set request body', async () => {
    const res = xml2js(`<set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>`);
    const setBody = new SetBody();
    const result = await setBody.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, variables: {}, connection: {},
      }, scope:Scope.inbound,
    });

    assert.equal(result.context.request.body, "bJtrpFi1fO1JMCcwLx8uZyAg");
  });

  it('U-TEST-2 - Test set request body to valriable', async () => {
    const res = xml2js(`<set-body response-variable-name="ResponseVariable">bJtrpFi1fO1JMCcwLx8uZyAg</set-body>`);
    const setBody = new SetBody();
    const result = await setBody.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, variables: {}, connection: {},
      }, scope:Scope.inbound,
    });

    assert.equal(get(result, 'context.variables.ResponseVariable'), "bJtrpFi1fO1JMCcwLx8uZyAg");
  });

  it('U-TEST-3 - Validate policy test', async () => {
    const setBody = new SetBody();
    const policy = xml2js(`<set-body response-variable-name="ResponseVariable">bJtrpFi1fO1JMCcwLx8uZyAg</set-body>`).elements[0];
    const validationResult = setBody.validate(policy);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-4 - Validate policy test, with errors', async () => {
    const setBody = new SetBody();
    const policy = xml2js(`<set-body></set-body>`).elements[0];
    const validationResult = setBody.validate(policy);
    assert.deepEqual(validationResult, [
      "set-body-ERR-001: Body should be set as policy body. For example, <set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>",
    ]);
  });
});