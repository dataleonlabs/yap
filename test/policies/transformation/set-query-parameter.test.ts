import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import { Scope } from '../../../src/policies';
import SetQueryParam from '../../../src/policies/transformation/set-query-parameter';

describe('<set-query-parameter />', () => {

  it('U-TEST-1 - Test query params multiple Skip, override, append & delete', async () => {
    const res = xml2js(`
            <set-query-parameter>
              <parameter name="api-key-one" exists-action="skip">
                <value>12345678901</value>
              </parameter>
              <parameter name="api-key-two" exists-action="override">
                <value>12345678902</value>
              </parameter>
              <parameter name="api-key-three" exists-action="append">
                <value>12345678901</value>
              </parameter>
              <parameter name="api-key-three" exists-action="delete">
                <value>541120125FF</value>
              </parameter>
            </set-query-parameter>
            `);
    const setQueryParam = new SetQueryParam();
    const resIp = await setQueryParam.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.queryStringParameters.api-key-two'), '12345678902');
  });

  it('U-TEST-2 - Test query single param with append', async () => {
    const res = xml2js(`
            <set-query-parameter>
              <parameter name="api-key-one" exists-action="append">
                <value>12345678901</value>
              </parameter>
            </set-query-parameter>
            `);
    const setQueryParam = new SetQueryParam();
    const resIp = await setQueryParam.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.queryStringParameters.api-key-one'), '12345678901');
  });

  it('U-TEST-3 - Test query params multiple with skip', async () => {
    const res = xml2js(`
            <set-query-parameter>
              <parameter name="api-key-one" exists-action="append">
                <value>12345678901</value>
              </parameter>
              <parameter name="api-key-three" exists-action="skip">
                <value>12345678901</value>
              </parameter>
            </set-query-parameter>
            `);
    const setQueryParam = new SetQueryParam();
    const resIp = await setQueryParam.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.queryStringParameters.api-key-one'), '12345678901');
  });

  it('U-TEST-4 - Test query params multiple with override', async () => {
    const res = xml2js(`
            <set-query-parameter>
              <parameter name="api-key-one" exists-action="append">
                <value>12345678901</value>
              </parameter>
              <parameter name="api-key-three" exists-action="override">
                <value>12345678901</value>
              </parameter>
            </set-query-parameter>
            `);
    const setQueryParam = new SetQueryParam();
    const resIp = await setQueryParam.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.queryStringParameters.api-key-three'), '12345678901');
  });

  it('U-TEST-5 - Test query params multiple with delete', async () => {
    const res = xml2js(`
            <set-query-parameter>
              <parameter name="api-key-one" exists-action="append">
                <value>12345678901</value>
              </parameter>
              <parameter name="api-key-three" exists-action="append">
                <value>12345678901</value>
              </parameter>
              <parameter name="api-key-one" exists-action="delete">
                <value>12345678901</value>
              </parameter>
            </set-query-parameter>
            `);
    const setQueryParam = new SetQueryParam();
    const resIp = await setQueryParam.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.queryStringParameters.api-key-three'), '12345678901');
  });

  it('U-TEST-6 - Test policy validation', async () => {
    const policy = xml2js(`
    <set-query-parameter>
      <parameter name="api-key-one" exists-action="append">
        <value>12345678901</value>
      </parameter>
      <parameter name="api-key-three" exists-action="append">
        <value>12345678901</value>
      </parameter>
      <parameter name="api-key-one" exists-action="delete">
        <value>12345678901</value>
      </parameter>
    </set-query-parameter>
    `).elements[0];
    const setQueryParam = new SetQueryParam();
    const validationResult = setQueryParam.validate(policy);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-7 - Test policy validation, with errors', async () => {
    const policy = xml2js(`
    <set-query-parameter>
      <parameter name="api-key-one" exists-action="append">
        <value>12345678901</value>
      </parameter>
      <parameter name="api-key-three" exists-action="append">
      </parameter>
      <parameter exists-action="delete">
        <value>12345678901</value>
      </parameter>
    </set-query-parameter>
    `).elements[0];
    const setQueryParam = new SetQueryParam();
    const validationResult = setQueryParam.validate(policy);
    assert.deepEqual(validationResult, [
      "set-query-parameter-ERR-003: At least one of value of query parameter should be set for node <parameter>. Example <value>Bearer error=\"invalid_token\"</value>",
      "set-query-parameter-ERR-002: Name attribute should be set. For example name=\"WWW-Authenticate\"",
    ]);
  });
});