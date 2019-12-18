import { xml2js } from 'xml-js';
import assert from 'assert';
import { get } from 'lodash';
import setHeader from '../../../src/policies/transformation/set-header';

describe('Router', () => {

// Add four test cases for it
// Check for inbound and outbound type

    it('U-TEST-1 - Test set request header override', async () => {
      const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="override">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
      const resIp = await setHeader(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert.equal(get(resIp, 'context.response.headers.WWW-Authenticate'), 'Bearer error="invalid_token"');
    });

    it('U-TEST-2 - Test set request header append', async () => {
      const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="append">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
      const resIp = await setHeader(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert.equal(get(resIp, 'context.response.headers.WWW-Authenticate'), 'Bearer error="invalid_token"');
    });

    it('U-TEST-3 - Test set request header skip', async () => {
      const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="skip">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
      const resIp = await setHeader(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      //if header is available or not?
      assert.equal(get(resIp, 'context.response.headers'), undefined);
    });

    it('U-TEST-4 - Test set request header delete', async () => {
      const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="delete">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
      const resIp = await setHeader(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert.equal(get(resIp, 'context.response.headers'), undefined);
    });
    
  });