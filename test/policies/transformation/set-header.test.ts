import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import { Scope } from '../../../src/policies';
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
    const resIp = await setHeader.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.headers.WWW-Authenticate'), 'Bearer error="invalid_token"');
  });

  it('U-TEST-2 - Test set request header append', async () => {
    const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="append">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
    const setHeader = new SetHeader();
    const resIp = await setHeader.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.headers.WWW-Authenticate'), 'Bearer error="invalid_token"');
  });

  it('U-TEST-3 - Test set request header skip', async () => {
    const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="skip">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
    const setHeader = new SetHeader();
    const resIp = await setHeader.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap', headers: { 'WWW-Authenticate': 'YAY!' } },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.deepEqual(get(resIp, 'context.request.headers'), { 'WWW-Authenticate': 'YAY!' });
  });

  it('U-TEST-4 - Test set request header delete', async () => {
    const res = xml2js(`
            <set-header name="WWW-Authenticate" exists-action="delete">
              <value>Bearer error="invalid_token"</value>
            </set-header>
            `);
    const setHeader = new SetHeader();
    const resIp = await setHeader.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.headers'), undefined);
  });

  it('U-TEST-5 - Should validate policy', async () => {
    const policy = xml2js(`
    <set-header name="WWW-Authenticate" exists-action="delete">
      <value>Bearer error="invalid_token"</value>
    </set-header>
    `).elements[0];
    const setHeader = new SetHeader();
    const validationResult = setHeader.validate(policy);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-6 - Should validate policy, with errors', async () => {
    const policy = xml2js(`
    <set-header>
    </set-header>
    `).elements[0];
    const setHeader = new SetHeader();
    const validationResult = setHeader.validate(policy);
    assert.deepEqual(validationResult, [
      "set-header-ERR-001: Name attribute should be set. For example name=\"WWW-Authenticate\"",
      "set-header-ERR-002: At least one of value of headers should be set. Example <value>Bearer error=\"invalid_token\"</value>"]);
  });
});