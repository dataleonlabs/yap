import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import SetMethod from '../../../src/policies/advanced/set-method';

describe('<set-method />', () => {

    it('U-TEST-1 - Test set request method', async () => {
      const setMethod = new SetMethod();
      const res = xml2js(`
            <set-method>POST</set-method>
            `);
      const resIp = await setMethod.apply({ policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: 'inbound' });
      assert.equal(get(resIp, 'context.request.httpMethod'), "POST");
    });
  });