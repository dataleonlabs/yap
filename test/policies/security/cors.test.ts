import assert from 'assert';
import { get } from 'lodash';
import { xml2js } from 'xml-js';
import cors from '../../../src/policies/security/cors';

// follow https://stackoverflow.com/questions/33062097/how-can-i-retrieve-a-users-public-ip-address-via-amazon-api-gateway-lambda-n
describe('Router', () => {

  it('U-TEST-1 - Test cors for all usecase ', async () => {
    const res = xml2js(`
          <cors allow-credentials="true">
             <allowed-origins>
                 <origin>http://localhost:8080/</origin>
                 <origin>http://example.com/</origin>
             </allowed-origins>
             <allowed-methods preflight-result-max-age="300">
                 <method>GET</method>
                 <method>POST</method>
                 <method>PATCH</method>
                 <method>DELETE</method>
             </allowed-methods>
             <allowed-headers>
                 <header>x-zumo-installation-id</header>
                 <header>x-zumo-application</header>
                 <header>x-zumo-version</header>
                 <header>x-zumo-auth</header>
                 <header>content-type</header>
                 <header>accept</header>
             </allowed-headers>
             <expose-headers>
                 <header>x-zumo-installation-id</header>
                 <header>x-zumo-application</header>
             </expose-headers>
          </cors>
          `);

    const resIp = await cors(res.elements[0], {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, 'inbound');

    assert.equal(get(resIp, 'context.response.headers.allowed-methods'), "GET,POST,PATCH,DELETE");
    assert.equal(get(resIp, 'context.response.headers.allowed-headers'), "x-zumo-installation-id,x-zumo-application,x-zumo-version,x-zumo-auth,content-type,accept");
    assert.equal(get(resIp, 'context.response.headers.allowed-origins'), "http://localhost:8080/,http://example.com/");
    assert.equal(get(resIp, 'context.response.headers.expose-headers'), "x-zumo-installation-id,x-zumo-application");
    assert.equal(get(resIp, 'context.response.headers.allow-credentials'), "true");
  });

  it('U-TEST-2 - Test cors for allowed origin', async () => {
    const res = xml2js(`
          <cors allow-credentials="true">
             <allowed-origins>
                 <origin>http://localhost:8080/</origin>
                 <origin>http://example.com/</origin>
             </allowed-origins>
          </cors>
          `);

    const resIp = await cors(res.elements[0], {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, 'inbound');

    assert.equal(get(resIp, 'context.response.headers.allowed-origins'), "http://localhost:8080/,http://example.com/");
    assert.equal(get(resIp, 'context.response.headers.allow-credentials'), "true");
  });

  it('U-TEST-3 - Test cors for allowed methods', async () => {
    const res = xml2js(`
          <cors allow-credentials="true">
             <allowed-methods preflight-result-max-age="300">
                 <method>GET</method>
                 <method>POST</method>
                 <method>PATCH</method>
                 <method>DELETE</method>
             </allowed-methods>
          </cors>
          `);

    const resIp = await cors(res.elements[0], {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, 'inbound');

    assert.equal(get(resIp, 'context.response.headers.allowed-methods'), "GET,POST,PATCH,DELETE");
    assert.equal(get(resIp, 'context.response.headers.allow-credentials'), "true");
  });

  it('U-TEST-4 - Test cors for allowed headers', async () => {
    const res = xml2js(`
          <cors allow-credentials="true">
             <allowed-headers>
                 <header>x-zumo-installation-id</header>
                 <header>x-zumo-application</header>
                 <header>x-zumo-version</header>
                 <header>x-zumo-auth</header>
                 <header>content-type</header>
                 <header>accept</header>
             </allowed-headers>
          </cors>
          `);

    const resIp = await cors(res.elements[0], {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, 'inbound');

    assert.equal(get(resIp, 'context.response.headers.allowed-headers'), "x-zumo-installation-id,x-zumo-application,x-zumo-version,x-zumo-auth,content-type,accept");
    assert.equal(get(resIp, 'context.response.headers.allow-credentials'), "true");
  });

  it('U-TEST-5 - Test cors for expose headers', async () => {
    const res = xml2js(`
          <cors allow-credentials="true">
             <expose-headers>
                 <header>x-zumo-installation-id</header>
                 <header>x-zumo-application</header>
             </expose-headers>
          </cors>
          `);

    const resIp = await cors(res.elements[0], {
      request: { httpMethod: 'POST', path: '/contacts/yap' },
      response: {}, fields: {}, connection: {},
    }, 'inbound');
    assert.equal(get(resIp, 'context.response.headers.expose-headers'), "x-zumo-installation-id,x-zumo-application");
    assert.equal(get(resIp, 'context.response.headers.allow-credentials'), "true");
  });
});