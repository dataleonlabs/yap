import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import SetVariable from '../../../src/policies/advanced/set-variable';

describe('<set-variable />', () => {

    it('U-TEST-1 - Test variable', async () => {
      const res = xml2js(`
            <set-variable name="username" value="Jhon" />
            `);
      const setVariable = new SetVariable();
      const resIp = await setVariable.apply({ policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: 'inbound'});
      assert.equal(get(resIp, 'context.fields.username'), "Jhon");
    });
  });