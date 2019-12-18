import { xml2js } from 'xml-js';
import assert from 'assert';
import response from './return-response';

describe('Router', () => {

    it('U-TEST-1 - Test return response', async () => {
      const res = xml2js(`
            <return-response>
                <set-status code="401" reason="Unauthorized"/>
                <set-header name="WWW-Authenticate" exists-action="override">
                   <value>Bearer error="invalid_token"</value>
                </set-header>
             </return-response>
            `);
      const resIp = await response(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert(resIp.context);
    });
  });