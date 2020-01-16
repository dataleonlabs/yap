import assert from 'assert';
import { xml2js } from 'xml-js';
import ReturnResponse from '../../../src/policies/advanced/ReturnResponse';
import { Scope } from '../../../src/policies/policy';
import assertThrowsAsync from 'assert-throws-async';
import { get } from 'lodash';
import { getTestRequest } from '../../tools';

describe('<return-response />', () => {

  it('U-TEST-1 - Test return response', async () => {
    const res = xml2js(`
            <return-response>
                <set-status code="401" reason="Unauthorized"/>
                <set-header name="WWW-Authenticate" exists-action="override">
                   <value>Bearer error="invalid_token"</value>
                </set-header>
                <set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>
             </return-response>
            `);
    const returnResponse = new ReturnResponse();
    const context = {
      request: getTestRequest(),
      response: {}, variables: {}, connection: {},
    };
    await assertThrowsAsync(() => returnResponse.apply({
      policyElement: res.elements[0], context, scope: Scope.inbound
    }), Error)
    assert.equal(get(context, 'response.statusCode'), '401');
    assert.equal(get(context, 'response.body'), 'bJtrpFi1fO1JMCcwLx8uZyAg');
    assert.deepEqual(get(context, `response.headers['WWW-Authenticate']`), [ 'Bearer error="invalid_token"' ])
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