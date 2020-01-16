import * as AWS from 'aws-sdk';
import { get, set } from 'lodash';
import policyManager, { tryExecuteFieldValue } from '..';
import { ExecutionContext, Policy, PolicyCategory, Scope, YapPolicy } from '../../';

/**
 * The cloudwatch-logs policy sends logs to Amazon CloudWatch.
 * Uploads log events to the specified log stream.
 * If a call to cloudwatch-logs returns "UnrecognizedClientException"
 * the most likely cause is an invalid AWS access key ID or secret key.
 * @example
 * <policies>
 *   <inbound>
 *       <cloudwatch-logs credentials="@(context.connections.aws)"
 *           log-stream-name="my-api" log-group-name="my-api-group" sequence-token="xx-x">
 *           <message>@(context.response.body)</message>
 *       </cloudwatch-logs>
 *   </inbound>
 * </policies>
 */
@YapPolicy({
    id: 'cloudwatch-logs',
    name: 'CLoudwatch logs policy',
    category: PolicyCategory.advanced,
    description: "The cloudwatch-logs policy sends logs to Amazon CloudWatch.",
    scopes: [Scope.inbound, Scope.outbound, Scope.onerror],
})
export default class CloudWatchLogs extends Policy {

    /**
     * Applies control flow policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement } = executionContext;
        const awsCredentials = tryExecuteFieldValue(get(policyElement, "attributes.credentials"), executionContext);
        const logStreamName = tryExecuteFieldValue(get(policyElement, 'attributes.log-stream-name'), executionContext);
        const logGroupName = tryExecuteFieldValue(get(policyElement, 'attributes.log-group-name'), executionContext);
        let nextSequenceToken = tryExecuteFieldValue(get(policyElement, 'attributes.sequence-token'), executionContext);
        if (awsCredentials && (!AWS.config.credentials?.accessKeyId || (AWS.config.credentials.accessKeyId !== awsCredentials.accessKeyId))) {
            AWS.config.region = awsCredentials.region;
            AWS.config.credentials = {
                accessKeyId: awsCredentials.accessKeyId,
                secretAccessKey: awsCredentials.secretAccessKey,
            };
        }
        const cloudwatchlogs = new AWS.CloudWatchLogs();
        if (!nextSequenceToken) {
            const streamDescription = await cloudwatchlogs.describeLogStreams({
                logGroupName,
                logStreamNamePrefix: logStreamName,
            }).promise();
            nextSequenceToken = get(streamDescription, 'logStreams[0].uploadSequenceToken');
            set(policyElement, 'attributes.sequence-token', nextSequenceToken);
        }
        for (const element of policyElement.elements) {
            const message = tryExecuteFieldValue(get(element, 'elements[0].text'), executionContext);
            const addLogEventResult = await cloudwatchlogs.putLogEvents({
                logEvents: [{
                    message: JSON.stringify(message),
                    timestamp: new Date().getTime(),
                }],
                logGroupName,
                logStreamName,
                sequenceToken: nextSequenceToken,
            }).promise();
        }
        return executionContext;
    }

    /**
     * Validates control flow policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const elements = get(policyElement, 'elements');
        const errors: string[] = [];
        if (!get(policyElement, 'attributes.credentials')) {
            errors.push(`${this.id}-ERR-001: policy should contain attribute credentials. ` +
                `Example credentials="@(context.connections.aws)"`);
        }
        if (!get(policyElement, 'attributes.log-stream-name')) {
            errors.push(`${this.id}-ERR-002: policy should contain attribute log-stream-name. ` +
                `Example log-stream-name="@(context.variables.aws.log-stream-name)"`);
        }
        if (!get(policyElement, 'attributes.log-group-name')) {
            errors.push(`${this.id}-ERR-003: policy should contain attribute log-group-name. ` +
                `Example log-group-name="@(context.variables.aws.log-group-name)"`);
        }
        if (!elements || !elements.length) {
            errors.push(`${this.id}-ERR-004: policy should contain elements, to read log data`);
        } else {
            for (const element of elements) {
                if (!get(element, 'elements[0].text')) {
                    errors.push(`${this.id}-ERR-005: Found element without value. Each element should contain value.`);
                }
            }
        }
        return errors;
    }
}