import { get, set } from "lodash";
import { ExecutionContext, Policy, PolicyCategory, Scope, YapPolicy } from '../../';

/**
 * <mock-response> policy
 * The mock-response, as the name implies, is used to mock APIs and operations.
 * It aborts normal pipeline execution and returns a mocked response to the caller.
 * @example
 *
 *  Returns 200 OK status code. Content is based on parameter body (optional)
 *  <mock-response status-code='200' content-type='application/json' body='someBody'/>
 */
@YapPolicy({
    id: 'mock-response',
    name: 'Mock response policy',
    category: PolicyCategory.advanced,
    description: "The mock-response, as the name implies, is used to mock APIs and operations.",
    scopes: [Scope.inbound, Scope.onerror, Scope.outbound],
  })
export default class MockResponse extends Policy {

    /**
     * Applies mock response policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        context.response.body = policyElement.attributes.body || context.response.body;
        context.response.statusCode = policyElement.attributes['status-code'] || context.response.statusCode;
        if (policyElement.attributes['content-type']) {
            set(context, 'response.headers.content-type', policyElement.attributes['content-type']);
        }
        return executionContext;
    }

    /**
     * Validates mock response policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const httpCode = get(policyElement, 'attributes.status-code');
        const errors = [];
        if (httpCode && isNaN(Number.parseInt(httpCode))) {
            errors.push(`${this.id}-ERR-001: attribute 'status-code' should persist and be a number. Example status-code='200'`);
        }
        return errors;
    }
}