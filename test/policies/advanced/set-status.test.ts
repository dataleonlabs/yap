import assert from 'assert';
import { xml2js } from 'xml-js';
import SetStatus from '../../../src/policies/advanced/set-status';

describe('<set-status />', () => {

  it('U-TEST-1 - Test status with reason', async () => {
    const res = await xml2js(`
            <set-status code="401" reason="Unauthorized"/>
            `);
    const setStatus = new SetStatus();
    const resIp = await setStatus.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
    assert.equal(resIp.context.response.statusCode, "401");
    assert.equal(resIp.context.response.body, "Unauthorized");
    // pass reason to body
  });

  it('U-TEST-2 - Test status without reason', async () => {
    const res = xml2js(`
            <set-status code="200"/>
            `);
    const setStatus = new SetStatus();
    const resIp = await setStatus.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
    assert.equal(resIp.context.response.statusCode, "200");
    // pass reason to body
  });
});