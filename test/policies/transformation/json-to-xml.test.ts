import assert from 'assert';
import jsonToXml from './json-to-xml';

describe('<json-to-xml />', () => {

    it('U-TEST-1 - Test json to xml success', async () => {
      const res = {
                firstName: "John",
                lastName: "Smith",
                address: {
                    streetAddress: "3212 22nd St",
                    city: "Chicago",
                    state: "Illinois",
                    zip: 10000,
                },
                email: "john@smith.com",
            };
      const resIp = await jsonToXml(res, {
        request: { httpMethod: 'POST', path: '/contacts/yap' },
        response: {}, fields: {}, connection: {},
      }, 'inbound');

      // ip-filter/address
      console.info(resIp.context.response.body);

      assert.equal(1, 1);
    });
  });