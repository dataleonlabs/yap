import assert from 'assert';
import { xml2js } from 'xml-js';
import FindAndReplace from '../../../src/policies/transformation/find-and-replace';

describe('<find-and-replace />', () => {

  it('U-TEST-1 - Test find and replace inbound in request', async () => {
    const findAndReplace = new FindAndReplace();
    const res = xml2js(`<find-and-replace from="notebook.name" to="laptop.parentNotebookName" />`);
    const resIp = await findAndReplace.apply({ policyElement: res.elements[0], context: {
      request: { httpMethod: 'POST', path: '/contacts/yap', body: { notebook: { name: 'laptop name' }, laptop: { name: 'laptop name' } } },
      response: {}, fields: {}, connection: {},
    }, scope: 'inbound' });
    assert.deepEqual(resIp.context.request.body.laptop, {
      name: 'laptop name',
      parentNotebookName: 'laptop name',
    });
  });

  it('U-TEST-2 - Test find and replace inbound in response', async () => {
    const findAndReplace = new FindAndReplace();
    const res = xml2js(`<find-and-replace from="notebook.name" to="laptop.parentNotebookName" />`);
    const resIp = await findAndReplace.apply({ policyElement: res.elements[0], context: {
      response: { body: { notebook: { name: 'laptop name' }, laptop: { name: 'laptop name' } } },
      request: {}, fields: {}, connection: {},
    }, scope: 'outbound'});
    assert.deepEqual(resIp.context.response.body.laptop, {
      name: 'laptop name',
      parentNotebookName: 'laptop name',
    });
  });
});