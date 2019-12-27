import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import { Scope } from '../../../src/policies';
import RewritePath from '../../../src/policies/transformation/rewrite-path';

describe('<rewrite-path />', () => {

  it('U-TEST-1 - Test rewrite path', async () => {
    const rewritePath = new RewritePath();
    const res = xml2js(`<rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>`);
    const resIp = await rewritePath.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope:Scope.inbound,
    });
    assert.equal(get(resIp, 'context.request.path'), "/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg");
  });

  it('U-TEST-2 - Validate policy test', async () => {
    const rewritePath = new RewritePath();
    const policy = xml2js(`<rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>`).elements[0];
    const validationResult = rewritePath.validate(policy);
    assert.deepEqual(validationResult, []);
  });

  it('U-TEST-3 - Validate policy test, with errors', async () => {
    const rewritePath = new RewritePath();
    const policy = xml2js(`<rewrite-path></rewrite-path>`).elements[0];
    const validationResult = rewritePath.validate(policy);
    assert.deepEqual(validationResult, [
      "rewrite-path-ERR-001: Path should be set as policy body. For example, <rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>",
    ]);
  });
});