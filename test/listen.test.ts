import assert from 'assert';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context as AWSContext } from 'aws-lambda';
import AWS from 'aws-sdk';
import { get, set } from 'lodash';
import supertest from 'supertest';
import 'mocha';
import * as sinon from 'sinon';
import { xml2js } from 'xml-js';
import Yap, { Context, Scope, ExecutionContext, PolicyCategory, YapConnector, Connector, } from '../src/index';
import policyManager from '../src/policies';
import { getTestAwsContext, getTestContext, getTestRequest } from './tools';
import ConnectorCategory from '../src/connectors/ConnectorCategory';

describe('Listen', () => {

    const result = [
        {
            id: "1",
            data: "first",
        },
        {
            id: "2",
            data: "second",
        },
        {
            id: "3",
            data: "thirdUntrim    ",
        },
    ];
    const typeDefs = `
        type Query { fields: [Field] }
        type Field { id: String, data: String }
    `;

    @YapConnector({
        id: "testConnector",
        name: "testConnector",
        category: ConnectorCategory.dataprocessing,
        description: "testDescription"
    })
    class TestConnector extends Connector {
        public async execute(parent: any, args: any, context: Context, info: any) {
            return await new Promise(res => res(result));
        }
    }

    const testConnector = new TestConnector();

    const resolvers = {
        Query: { fields: testConnector.execute },
    };

    const app = new Yap({ typeDefs, resolvers });
    let server: any = null;
    let request: any = null;

    before(() => {
        server = app.listen(3010)
        request = supertest.agent(server)
    })

    after((done) => {
        server.close(done)
    })

    it('U-TEST-1 - Creates Yap core, executes request with http', async () => {
        const res = await request.post('/hello')
            .send({ query: "query { fields { id, data } }" }).expect(200)

        assert.deepEqual(res.body.data.fields, result);
    });
});