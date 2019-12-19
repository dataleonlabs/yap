import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import AuthBasic from '../../../src/policies/authentification/authentication-basic';

describe('<authentication-basic />', () => {

  it('U-TEST-1 - Test username and password set correctly', async () => {
    const res = xml2js(`<authentication-basic username="Jhon" password="john@123" />`);
    const authBasic = new AuthBasic();
    const resIp = await authBasic.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound' });
    assert.equal(get(resIp.context, 'request.headers.Authorization'), "Basic Smhvbjpqb2huQDEyMw==");
  });

});