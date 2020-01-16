import assert from 'assert';
import { xml2js } from 'xml-js';
import { Scope } from '../../../src';
import FindAndReplace from '../../../src/policies/transformation/FindAndReplace';

describe('<find-and-replace />', () => {

  it('U-TEST-1 - Test find and replace inbound in request', async () => {
    const findAndReplace = new FindAndReplace();
    const res = xml2js(`<find-and-replace from="notebook.name" to="laptop.parentNotebookName" />`);
    const resIp = await findAndReplace.apply({
      policyElement: res.elements[0], context: {
        request: { httpMethod: 'POST', path: '/contacts/yap', body: { notebook: { name: 'laptop name' }, laptop: { name: 'laptop name' } } },
        response: {}, variables: {}, connection: {},
      }, scope: Scope.inbound,
    });
    assert.deepEqual(resIp.context.request.body.laptop, {
      name: 'laptop name',
      parentNotebookName: 'laptop name',
    });
  });

  it('U-TEST-2 - Test find and replace inbound in response', async () => {
    const findAndReplace = new FindAndReplace();
    const res = xml2js(`<find-and-replace from="notebook.name" to="laptop.parentNotebookName" />`);
    const resIp = await findAndReplace.apply({
      policyElement: res.elements[0], context: {
        response: { body: { notebook: { name: 'laptop name' }, laptop: { name: 'laptop name' } } },
        request: {}, variables: {}, connection: {},
      }, scope: Scope.outbound,
    });
    assert.deepEqual(resIp.context.response.body.laptop, {
      name: 'laptop name',
      parentNotebookName: 'laptop name',
    });
  });

  it('U-TEST-3 - Should validate policy', async () => {
    const findAndReplace = new FindAndReplace();
    const policy = xml2js(`<find-and-replace from="notebook.name" to="laptop.parentNotebookName" />`).elements[0];
    const validationRsult = findAndReplace.validate(policy);
    assert.deepEqual(validationRsult, []);
  });

  it('U-TEST-4 - Should validate policy, with errors', async () => {
    const findAndReplace = new FindAndReplace();
    const policy = xml2js(`<find-and-replace/>`).elements[0];
    const validationRsult = findAndReplace.validate(policy);
    assert.deepEqual(validationRsult, [
      "find-and-replace-ERR-001: attribute 'from' is required",
      "find-and-replace-ERR-002: attribute 'to' is required",
    ]);
  });
});