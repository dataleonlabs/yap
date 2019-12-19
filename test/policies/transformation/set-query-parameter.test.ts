import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
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
    const resIp = await setQueryParam.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
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
    const resIp = await setQueryParam.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
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
    const resIp = await setQueryParam.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
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
    const resIp = await setQueryParam.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
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
    const resIp = await setQueryParam.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound'});
    assert.equal(get(resIp, 'context.request.queryStringParameters.api-key-three'), '12345678901');
  });
});