import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import AuthBasic from '../../../src/policies/authentification/AuthenticationBasic';
import { Scope } from '../../../src/policies/policy';

describe('<authentication-basic />', () => {

  it('U-TEST-1 - Test username and password set correctly', async () => {
    const res = xml2js(`<authentication-basic username="Jhon" password="john@123" />`);
    const authBasic = new AuthBasic();
    const resIp = await authBasic.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, variables: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.equal(get(resIp.context, 'request.headers.Authorization'), "Basic Smhvbjpqb2huQDEyMw==");
  });

  it('U-TEST-2 - Should validate policy', async () => {
    const policy = xml2js(`<authentication-basic username="Jhon" password="john@123" />`).elements[0];
    const authBasic = new AuthBasic();
    const validationResult = authBasic.validate(policy);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-3 - Should validate policy', async () => {
    const policy = xml2js(`<authentication-basic />`).elements[0];
    const authBasic = new AuthBasic();
    const validationResult = authBasic.validate(policy);
    assert.deepEqual(validationResult, [
      "authentication-basic-ERR-001: username should be set in attributes, for example username=\"username\"",
      "authentication-basic-ERR-002: password should be set in attributes, for example password=\"password\"",
    ]);
  });
});