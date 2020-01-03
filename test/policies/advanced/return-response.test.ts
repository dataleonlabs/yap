import assert from 'assert';
import { xml2js } from 'xml-js';
import ReturnResponse from '../../../src/policies/advanced/return-response';
import { Scope } from '../../../src/policies/policy';

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
    const resIp = await returnResponse.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert(resIp.context);
  });

  it('U-TEST-2 - Should validate policy', async () => {
    const res = xml2js(`
      <return-response>
          <set-status code="401" reason="Unauthorized"/>
          <set-header name="WWW-Authenticate" exists-action="override">
             <value>Bearer error="invalid_token"</value>
          </set-header>
       </return-response>
      `).elements[0];
    const returnResponse = new ReturnResponse();
    const validationResult = returnResponse.validate(res);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-3 - Should validate policy with errors', async () => {
    const res = xml2js(`
      <return-response>
          <set-shmatus/>
          <set-status/>
          <set-header name="WWW-Authenticate" exists-action="override">
             <value>Bearer error="invalid_token"</value>
          </set-header>
       </return-response>
      `).elements[0];
    const returnResponse = new ReturnResponse();
    const validationResult = returnResponse.validate(res);
    assert.deepEqual(validationResult, [
      "return-response-ERR-002: XML tag <return-response> contains policy <set-shmatus>. Only <set-header> <set-body> or <set-status> allowed",
      "set-status-ERR-001: code should be set in attributes, for example code=\"401\"",
      "set-status-ERR-002: reason should be set in attributes, for example reason=\"Unauthorized\"",
    ]);
  });
});