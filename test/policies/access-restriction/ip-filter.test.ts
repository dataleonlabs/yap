import assert from 'assert';
import { xml2js } from 'xml-js';
import IpFilter from '../../../src/policies/access-restriction/ip-filter';
import { getTestRequest } from '../../tools';

describe('<ip-filter />', () => {
  it('U-TEST-1 check allow IP', async () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address>13.66.140.129</address>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const result = await ipFilter.apply({ policyElement: policy, context, scope: 'inbound'});
    assert.deepEqual(result, {policyElement: policy, context, scope: 'inbound'});
  });

  it('U-TEST-2 check allow range', async () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.128" to="13.66.140.129"/>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const result = await ipFilter.apply({ policyElement: policy, context, scope: 'inbound'});
    assert.deepEqual(result, {policyElement: policy, context, scope: 'inbound'});
  });

  it('U-TEST-3 check allow subnet', async () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-subnet>13.66.140.129/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const result = await ipFilter.apply({ policyElement: policy, context, scope: 'inbound'});
    assert.deepEqual(result, {policyElement: policy, context, scope: 'inbound'});
  });

  it('U-TEST-4 check allow IP/range/subnet', async () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.128" to="13.66.140.129"/>
            <address>13.66.140.129</address>
            <address-subnet>13.66.140.129/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const result = await ipFilter.apply({ policyElement: policy, context, scope: 'inbound'});
    assert.deepEqual(result, {policyElement: policy, context, scope: 'inbound'});
  });

  it('U-TEST-5 check deny IP', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address>13.66.140.128</address>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    assert.rejects(() => ipFilter.apply({ policyElement: policy, context, scope:'inbound'}), Error, "IP out of range");
  });

  it('U-TEST-6 check deny range', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.126" to="13.66.140.127"/>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    assert.rejects(() => ipFilter.apply({ policyElement: policy, context, scope:'inbound'}), Error, "IP out of range");
  });

  it('U-TEST-7 check deny subnet', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-subnet>13.66.110.128/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    assert.rejects(() => ipFilter.apply({ policyElement: policy, context, scope:'inbound'}), Error, "IP out of range");
  });

  it('U-TEST-8 check deny IP/range/subnet', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, fields: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.126" to="13.66.140.127"/>
            <address>13.66.140.122</address>
            <address-subnet>13.66.140.126/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    assert.rejects(() => ipFilter.apply({ policyElement: policy, context, scope:'inbound'}), Error, "IP out of range");
  });
});