import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import SetHeader from '../../../src/policies/transformation/set-header';

describe('<set-header />', () => {

  // Add four test cases for it
  // Check for inbound and outbound type

  it('U-TEST-1 - Test set request header override', async () => {
    const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="override">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
    const setHeader = new SetHeader();
    const resIp = await setHeader.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
    assert.equal(get(resIp, 'context.request.headers.WWW-Authenticate'), 'Bearer error="invalid_token"');
  });

  it('U-TEST-2 - Test set request header append', async () => {
    const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="append">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
    const setHeader = new SetHeader();
    const resIp = await setHeader.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
    assert.equal(get(resIp, 'context.request.headers.WWW-Authenticate'), 'Bearer error="invalid_token"');
  });

  it('U-TEST-3 - Test set request header skip', async () => {
    const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="skip">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
    const setHeader = new SetHeader();
    const resIp = await setHeader.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap', headers: {'WWW-Authenticate': 'YAY!'} },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
    assert.deepEqual(get(resIp, 'context.request.headers'), {'WWW-Authenticate': 'YAY!'});
  });

  it('U-TEST-4 - Test set request header delete', async () => {
    const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="delete">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
    const setHeader = new SetHeader();
    const resIp = await setHeader.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
    assert.equal(get(resIp, 'context.request.headers'), undefined);
  });

});