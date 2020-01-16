import assert from 'assert';
import { xml2js } from 'xml-js';
import IpFilter from '../../../src/policies/accessRestriction/IpFilter';
import { getTestRequest } from '../../tools';
import { Scope } from '../../../src';

describe('<ip-filter />', () => {
  it('U-TEST-1 check allow IP', async () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, variables: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address>13.66.140.129</address>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const result = await ipFilter.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.deepEqual(result, { policyElement: policy, context, scope: Scope.inbound });
  });

  it('U-TEST-2 check allow range', async () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, variables: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.128" to="13.66.140.129"/>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const result = await ipFilter.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.deepEqual(result, { policyElement: policy, context, scope: Scope.inbound });
  });

  it('U-TEST-3 check allow subnet', async () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, variables: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-subnet>13.66.140.129/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const result = await ipFilter.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.deepEqual(result, { policyElement: policy, context, scope: Scope.inbound });
  });

  it('U-TEST-4 check allow IP/range/subnet', async () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, variables: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.128" to="13.66.140.129"/>
            <address>13.66.140.129</address>
            <address-subnet>13.66.140.129/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const result = await ipFilter.apply({ policyElement: policy, context, scope: Scope.inbound });
    assert.deepEqual(result, { policyElement: policy, context, scope: Scope.inbound });
  });

  it('U-TEST-5 check deny IP', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, variables: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address>13.66.140.128</address>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    assert.rejects(() => ipFilter.apply({ policyElement: policy, context, scope: Scope.inbound }), Error, "IP out of range");
  });

  it('U-TEST-6 check deny range', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, variables: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.126" to="13.66.140.127"/>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    assert.rejects(() => ipFilter.apply({ policyElement: policy, context, scope: Scope.inbound }), Error, "IP out of range");
  });

  it('U-TEST-7 check deny subnet', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, variables: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-subnet>13.66.110.128/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    assert.rejects(() => ipFilter.apply({ policyElement: policy, context, scope: Scope.inbound }), Error, "IP out of range");
  });

  it('U-TEST-8 check deny IP/range/subnet', () => {
    const request = getTestRequest();
    request.requestContext.identity.sourceIp = "13.66.140.129";
    const context = {
      request,
      response: {}, variables: {}, connection: {},
    };
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.126" to="13.66.140.127"/>
            <address>13.66.140.122</address>
            <address-subnet>13.66.140.126/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    assert.rejects(() => ipFilter.apply({ policyElement: policy, context, scope: Scope.inbound }), Error, "IP out of range");
  });

  it('U-TEST-9 should validate policy', () => {
    const policy = xml2js(`
    <ip-filter action="allow">
            <address-range from="13.66.140.126" to="13.66.140.127"/>
            <address>13.66.140.122</address>
            <address-subnet>13.66.140.126/25</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const validationResult = ipFilter.validate(policy);
    assert.deepEqual(validationResult, []);
  });
  it('U-TEST-9 should validate policy, with errors', () => {
    const policy = xml2js(`
    <ip-filter action="allowy">
            <address-range from="notIp" to="notIp"/>
            <address>NotIp</address>
            <addressy>13.66.140.122</addressy>
            <address-subnet>13.66.140.126/NotANumber</address-subnet>
    </ip-filter>`).elements[0];
    const ipFilter = new IpFilter();
    const validationResult = ipFilter.validate(policy);
    assert.deepEqual(validationResult, [
      "ip-filter-ERR-001: attribute 'action' is required and should be neither allow or forbid",
      "ip-filter-ERR-006: Element name <address-range>. Have wrong attributes defined: from = notIp, to = notIp. Element should have correct from and to IP addreses defined, f.e. <address-range from=\"13.66.140.128\" to=\"13.66.255.143\"></address-subnet>",
      "ip-filter-ERR-004: Element name <address>. Have wrong ip defined: NotIp. Should be an IP adrreess f.e. <address>13.66.201.169</address>",
      "ip-filter-ERR-003: Element name <addressy> is not allowed. should be defined at least one sub element of <address>, <address-subnet> or <address-range>",
      "ip-filter-ERR-005: Element name <address-subnet>. Have wrong subnet defined: 13.66.140.126/NotANumber. Should be an IP adrreess f.e. <address-subnet>13.66.140.128/24</address-subnet>",
    ]);
  });
});