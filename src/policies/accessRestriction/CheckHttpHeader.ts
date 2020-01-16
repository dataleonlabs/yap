import { get } from 'lodash';
import { tryExecuteFieldValue } from '..';
import { ExecutionContext, Policy, PolicyCategory, Scope, YapPolicy } from '../../';

/**
 * check-header policy to enforce that a request has a specified HTTP header.
 * You can optionally check to see if the header has a specific value or check for a range of allowed values.
 * If the check fails, the policy terminates request processing and returns the HTTP status code and error message specified by the policy.
 * <check-header name="header name" failed-check-httpcode="code" failed-check-error-message="message" ignore-case="true">
 *   <value>Value1</value>
 *   <value>Value2</value>
 * </check-header>
 * @example
 *  <check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
 *     <value>f6dc69a089844cf6b2019bae6d36fac8</value>
 *  </check-header>
 */
@YapPolicy({
    id: 'check-header',
    name: 'Check HTTP header policy',
    category: PolicyCategory.accessrestriction,
    description: 'Check-header policy to enforce that a request has a specified HTTP header.',
    scopes: [Scope.inbound, Scope.outbound],
  })
export default class CheckHTTPHeader extends Policy {

    /**
     * Apply check header policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        let authorised = false;
        const ignoreCase = policyElement.attributes["ignore-case"] === "true";
        let headerValue = get(context, `request.requestContext.headers.${policyElement.attributes.name}`);
        if (headerValue && policyElement.elements) {
            headerValue = ignoreCase ? headerValue.toLowerCase() : headerValue;
            for (const element of policyElement.elements) {
                const { text } = tryExecuteFieldValue(element.elements[0], executionContext);
                if ((ignoreCase ? text.toLowerCase() : text) === headerValue) {
                    authorised = true;
                    break;
                }
            }
        }
        if (!authorised) {
            context.response.statusCode = policyElement.attributes["failed-check-httpcode"];
            context.response.body = policyElement.attributes["failed-check-error-message"];
            throw new Error("Not authorized");
        }
        return executionContext;
    }

    /**
     * Validate check header policy
     * @param executionContext execution context
     */
    public validate(policyElement: any) {
        const errorMessage = get(policyElement, 'attributes.failed-check-error-message');
        const httpCode = get(policyElement, 'attributes.failed-check-httpcode');
        const headerName = get(policyElement, 'attributes.name');
        const ignoreCase = get(policyElement, 'attributes.ignore-case');
        const errors = [];
        if (!errorMessage) {
            errors.push(`${this.id}-ERR-001: attribute 'failed-check-error-message' is required`);
        }
        if (!httpCode || isNaN(Number.parseInt(httpCode))) {
            errors.push(`${this.id}-ERR-002: attribute 'failed-check-httpcode' is required and should be integer`);
        }
        if (!headerName) {
            errors.push(`${this.id}-ERR-003: attribute 'name' is required`);
        }
        if (!ignoreCase || ["true", "false"].indexOf(ignoreCase) === -1) {
            errors.push(`${this.id}-ERR-004: attribute 'ignore-case' is required, and should be either true or false`);
        }
        return errors;
    }
}