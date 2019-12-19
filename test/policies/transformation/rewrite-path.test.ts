import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import RewritePath from '../../../src/policies/transformation/rewrite-path';

describe('<rewrite-path />', () => {

  it('U-TEST-1 - Test rewrite path', async () => {
    const rewritePath = new RewritePath();
    const res = xml2js(`<rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>`);
    const resIp = await rewritePath.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, scope: 'inbound',
    });
    assert.equal(get(resIp, 'context.request.path'), "/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg");
  });
});