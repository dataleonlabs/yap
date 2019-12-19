import assert from 'assert';
import { xml2js } from 'xml-js';
import ReturnResponse from '../../../src/policies/advanced/return-response';

describe('<return-response />', () => {

    it('U-TEST-1 - Test return response', async () => {
      const res = xml2js(`
            <return-response>
                <set-status code="401" reason="Unauthorized"/>
                <set-header name="WWW-Authenticate" exists-action="override">
                   <value>Bearer error="invalid_token"</value>
                </set-header>
             </return-response>
            `);
      const returnResponse = new ReturnResponse();
      const resIp = await returnResponse.apply({ policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: 'inbound' });
      assert(resIp.context);
    });
  });