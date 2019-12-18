import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import authBasic from '../../../src/policies/authentification/authentication-basic';

describe('Basic Authentication', () => {

  it('U-TEST-1 - Test basic user authentication success', async () => {
    const res = xml2js(`<authentication-basic username="Jhon" password="john@123" />`);
    const resIp = await authBasic(res.elements[0], {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, 'inbound');
    assert.equal(get(resIp, 'context.response.body'), "Request is valid");
  });

  it('U-TEST-2 - Test basic user authentication failed', async () => {
    const res = xml2js(`<authentication-basic username="Jack" password="" />`);
    const resIp = await authBasic(res.elements[0], {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, 'inbound');
    assert.equal(get(resIp, 'context.response.body'), "Request is not valid");
  });
});
