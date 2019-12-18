import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import setMethod from '../../../src/policies/transformation/set-method';

describe('Router', () => {

    it('U-TEST-1 - Test set request method', async () => {
      const res = xml2js(`
            <set-method>POST</set-method>
            `);
      const resIp = await setMethod(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert.equal(get(resIp, 'context.request.httpMethod'), "POST");
    });
  });