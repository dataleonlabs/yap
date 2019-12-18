import assert from 'assert';
import { xml2js } from 'xml-js';
import setBody from '../../../src/policies/transformation/set-body';

describe('Router', () => {

    it('U-TEST-1 - Test set response body', async () => {
      const res = xml2js(`<set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>`);
      const resIp = await setBody(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');

      assert.equal(resIp.context.response.body, "bJtrpFi1fO1JMCcwLx8uZyAg");
    });
  });