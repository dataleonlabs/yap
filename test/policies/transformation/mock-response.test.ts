import assert from 'assert';
import { xml2js } from 'xml-js';
import { get } from 'lodash';
import mockResponse from './mock-response';

describe('Router', () => {

// Add four test cases for it
// Check for inbound and outbound type

    it('U-TEST-1 - Test mockup', async () => {
      const res = xml2js(`<mock-response status-code='200' content-type='application/json'/>`);
      const resIp = await mockResponse(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert.equal(get(resIp, 'context.response.headers.content-type'), 'application/json');
      assert.equal(get(resIp, 'context.response.headers.status-code'), '200');
    });
  });