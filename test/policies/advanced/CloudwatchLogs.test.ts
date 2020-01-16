import assert from 'assert';
import * as AWS from 'aws-sdk';
import { PutLogEventsResponse } from 'aws-sdk/clients/cloudwatchlogs';
import { PromiseResult, Request } from 'aws-sdk/lib/request';
import { get, set, unset } from 'lodash';
import { Readable } from 'stream';
import { xml2js } from 'xml-js';
import CloudWatchLogs from '../../../src/policies/advanced/CloudwatchLogs';
import { getTestContext } from '../../tools';
import { Scope } from '../../../src';

const putLogsResult: PromiseResult<AWS.CloudWatchLogs.PutLogEventsResponse, AWS.AWSError>
    = {
    $response: {
        hasNextPage: () => false,
        requestId: "1",
        redirectCount: 1,
        httpResponse: new AWS.HttpResponse(),
        nextPage: () => void 0,
        data: void 0,
        error: void 0,
        retryCount: 0,
    },
};

const putLogsReturnResult: Request<PutLogEventsResponse, AWS.AWSError> = {
    promise: () => Promise.resolve(putLogsResult),
    abort: () => void 0,
    createReadStream: () => new Readable(),
    eachPage: () => void 0,
    isPageable: () => false,
    send: () => void 0,
    on: () => putLogsReturnResult,
    onAsync: () => putLogsReturnResult,
    startTime: new Date(),
    httpRequest: new AWS.HttpRequest(
        {
            host: "1",
            hostname: "1",
            href: "1",
            port: 1,
            protocol: "http",
        }, "us-east-1",
    ),
};

describe("<cloudwatch-logs/>", () => {
    it("Should send cloud watch event with token", async () => {
        const cloudWatchLogs = new CloudWatchLogs();
        const policy = `
        <cloudwatch-logs credentials="@(context.variables.AWSCredentials)" log-stream-name="@(context.variables.cloudWatchLogStream)" log-group-name="@(context.variables.cloudWatchLogGroup)" sequence-token="@(context.variables.cloudWatchSequenceToken)">
             <message>@(context.variables.logBatch)</message>
        </cloudwatch-logs>`;
        const policyElement = xml2js(policy).elements[0];
        let passedArgs: any = null;
        const oldProto = get(AWS, 'CloudWatchLogs.prototype.putLogEvents');
        set(AWS, 'CloudWatchLogs.prototype.putLogEvents',
            (params: AWS.CloudWatchLogs.PutLogEventsRequest,
                callback?: ((err: AWS.AWSError, data: AWS.CloudWatchLogs.PutLogEventsResponse) => void) | undefined) => {
                passedArgs = params;
                return putLogsReturnResult;
            });
        const context = getTestContext();
        const awsCreds = {
            region: "us-west-2",
            accessKeyId: "someKey",
            secretAccessKey: "someValue",
        };
        const logStreamName = "cloudWatchLogStream";
        const logGroupName = "cloudWatchLogGroup";
        const sequenceToken = "cloudWatchSequenceToken";
        const message = "message";
        set(context, 'variables.AWSCredentials', awsCreds);
        set(context, 'variables.cloudWatchLogStream', logStreamName);
        set(context, 'variables.cloudWatchLogGroup', logGroupName);
        set(context, 'variables.cloudWatchSequenceToken', sequenceToken);
        set(context, 'variables.logBatch', message);
        const response = cloudWatchLogs.apply({ policyElement, context, scope: Scope.inbound });
        unset(passedArgs, 'logEvents[0].timestamp');
        assert.deepEqual(passedArgs, {
            logEvents: [
                {
                    message: JSON.stringify(message),
                },
            ],
            sequenceToken,
            logGroupName,
            logStreamName,
        });
        set(AWS, 'CloudWatchLogs.prototype.putLogEvents', oldProto);
    });

    it("Should validate", () => {
        const cloudWatchLogs = new CloudWatchLogs();
        const policy = `
        <cloudwatch-logs credentials="@(context.variables.AWSCredentials)" log-stream-name="@(context.variables.cloudWatchLogStream)" log-group-name="@(context.variables.cloudWatchLogGroup)">
             <message>@(context.variables.logBatch)</message>
        </cloudwatch-logs>`;
        const policyElement = xml2js(policy).elements[0];
        const errors = cloudWatchLogs.validate(policyElement);
        assert.deepEqual(errors, []);
    });

    it("Should validate with errors", () => {
        const cloudWatchLogs = new CloudWatchLogs();
        const policy = `
        <cloudwatch-logs>
        </cloudwatch-logs>`;
        const policyElement = xml2js(policy).elements[0];
        const errors = cloudWatchLogs.validate(policyElement);
        assert.deepEqual(errors, [
            "cloudwatch-logs-ERR-001: policy should contain attribute credentials. Example credentials=\"@(context.connections.aws)\"",
            "cloudwatch-logs-ERR-002: policy should contain attribute log-stream-name. Example log-stream-name=\"@(context.variables.aws.log-stream-name)\"",
            "cloudwatch-logs-ERR-003: policy should contain attribute log-group-name. Example log-group-name=\"@(context.variables.aws.log-group-name)\"",
            "cloudwatch-logs-ERR-004: policy should contain elements, to read log data",
        ]);
    });
});