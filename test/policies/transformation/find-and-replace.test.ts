import { xml2js } from 'xml-js';
import assert from 'assert';
import findAndReplace from '../../../src/policies/transformation/find-and-replace';

describe('<find-and-replace />', () => {

    it('U-TEST-1 - Test find and replace', async () => {
      const res = xml2js(`<find-and-replace from="notebook" to="laptop" />`);
      const resIp = await findAndReplace(res.elements[0], {
        request: { httpMethod: 'POST', path: '/contacts/yap',  body: { 'notebook': 'this is test data for notebook', 'laptop': 'Testing laptop' } },
        response: {}, fields: {}, connection: {},
      }, 'inbound');
      assert.equal(resIp.context.request.body.laptop, "this is test data for laptop");
    });
  });