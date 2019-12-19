import assert from 'assert';
import { xml2js } from 'xml-js';
import SetBody from '../../../src/policies/transformation/set-body';

describe('<set-body />', () => {

  it('U-TEST-1 - Test set request body', async () => {
    const res = xml2js(`<set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>`);
    const setBody = new SetBody();
    const resIp = await setBody.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: 'inbound',
    });

    assert.equal(resIp.context.request.body, "bJtrpFi1fO1JMCcwLx8uZyAg");
  });
});