import assert from 'assert';
import ipFilter from '../../../src/policies/filters/ip-filter';
import { xml2js } from 'xml-js';
import { getTestRequest } from '../../tools';

describe('Router', () => {
  it('U-TEST-1 check allow IP', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {}
    }
    const policy = xml2js(`
    <ip-filter action="allow">
            <address>13.66.140.129</address>
    </ip-filter>`).elements[0];
    const result = ipFilter(policy, context, 'inbound');
    assert.deepEqual(result, {policyElement: policy, context, scope: 'inbound'})
  });

  it('U-TEST-2 check allow range', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {}
    }
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.128" to="13.66.140.129"/>
    </ip-filter>`).elements[0];
    const result = ipFilter(policy, context, 'inbound');
    assert.deepEqual(result, {policyElement: policy, context, scope: 'inbound'})
  });

  it('U-TEST-3 check allow subnet', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {}
    }
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-subnet>13.66.140.129/25</address-subnet>
    </ip-filter>`).elements[0];
    const result = ipFilter(policy, context, 'inbound');
    assert.deepEqual(result, {policyElement: policy, context, scope: 'inbound'})
  });

  it('U-TEST-4 check allow IP/range/subnet', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {}
    }
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.128" to="13.66.140.129"/>
            <address>13.66.140.129</address>
            <address-subnet>13.66.140.129/25</address-subnet>
    </ip-filter>`).elements[0];
    const result = ipFilter(policy, context, 'inbound');
    assert.deepEqual(result, {policyElement: policy, context, scope: 'inbound'})
  });

  it('U-TEST-5 check deny IP', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {}
    }
    const policy = xml2js(`
    <ip-filter action="allow">
            <address>13.66.140.128</address>
    </ip-filter>`).elements[0];
    assert.throws(() => ipFilter(policy, context, 'inbound'), Error, "IP out of range")
  });

  it('U-TEST-6 check deny range', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {}
    }
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.126" to="13.66.140.127"/>
    </ip-filter>`).elements[0];
    assert.throws(() => ipFilter(policy, context, 'inbound'), Error, "IP out of range")
  });

  it('U-TEST-7 check deny subnet', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {}
    }
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-subnet>13.66.110.128/25</address-subnet>
    </ip-filter>`).elements[0];
    assert.throws(() => ipFilter(policy, context, 'inbound'), Error, "IP out of range")
  });

  it('U-TEST-8 check deny IP/range/subnet', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {}
    }
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.126" to="13.66.140.127"/>
            <address>13.66.140.122</address>
            <address-subnet>13.66.140.126/25</address-subnet>
    </ip-filter>`).elements[0];
    assert.throws(() => ipFilter(policy, context, 'inbound'), Error, "IP out of range")
  });
});