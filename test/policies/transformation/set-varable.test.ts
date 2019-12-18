import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import setVarable from '../../../src/policies/transformation/set-varable';

describe('Router', () => {

    it('U-TEST-1 - Test variable', async () => {
      const res = xml2js(`
            <set-variable name="username" value="Jhon" />
            `);
      const resIp = await setVarable(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert.equal(get(resIp, 'context.fields.username'), "Jhon");
    });
  });