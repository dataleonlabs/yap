import { xml2js } from 'xml-js';
import assert from 'assert';
import { get } from 'lodash'
import rewritePath from '../../../src/policies/transformation/rewrite-path';

describe('Router', () => {

    it('U-TEST-1 - Test rewrite path', async () => {
      const res = xml2js(`<rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>`);
      const resIp = await rewritePath(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert.equal(get(resIp, 'context.request.path'), "/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg");
    });
  });