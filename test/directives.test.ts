import assert from 'assert';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context as AWSContext } from 'aws-lambda';
import AWS from 'aws-sdk';
import { get, set } from 'lodash';
import 'mocha';
import * as sinon from 'sinon';
import { xml2js } from 'xml-js';
import Yap, { Context, Scope, ExecutionContext, PolicyCategory, YapConnector, Connector, } from '../src/index';
import policyManager from '../src/policies';
import { getTestAwsContext, getTestContext, getTestRequest } from './tools';
import ConnectorCategory from '../src/connectors/ConnectorCategory';

describe('Directives', () => {

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
        type Field { id: String, data: String @trim}
    `;

    const query = JSON.stringify({
        query: "query fields{ fields { id, data } }",
    });

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

    const testConnector = new TestConnector;

    const resolvers = {
        Query: { fields: testConnector.execute },
    };

    it('U-TEST-1 - Test trim directive', async () => {

        const resultTrim = [
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
                data: "thirdUntrim",
            },
        ];
        const typeDefsTrim = `
            type Query { fields: [Field] }
            type Field { id: String, data: String @trim}
        `;

        const yap = new Yap({ typeDefs: typeDefsTrim, resolvers });
        const request = getTestRequest();
        const awsContext = getTestAwsContext();

        request.body = query;
        request.httpMethod = 'POST';
        set(request, 'headers.Accept', 'application/json');
        const queryResult = await yap.handler(request as unknown as APIGatewayProxyEvent, awsContext);
        const payload = JSON.parse(queryResult.body).data.fields;
        assert.deepEqual(payload, resultTrim);
    });

});