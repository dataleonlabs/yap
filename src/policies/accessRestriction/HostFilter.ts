import { get } from 'lodash';
import { tryExecuteFieldValue } from '..';
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

/**
 * Domain Filter Policy
 * @example
 * <host-filter action="allow" failed-check-httpcode="401" failed-check-error-message="Not authorized">
 *     <host>13.66.201.169</host>
 *     <host>13.66.201.168</host>
 * </host-filter>
 */
@YapPolicy({
    id: 'host-filter',
    name: 'Host domain filter policy',
    category: PolicyCategory.accessrestriction,
    description: "Filters request by originated domain",
    scopes: [Scope.inbound],
  })
export default class HostFilter extends Policy {

    /**
     * Applies host filter policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        let authorised = policyElement.attributes.action !== 'allow';
        const header = get(context, `request.requestContext.headers.x-forwarded-host`);
        if (header && policyElement.elements) {
            for (const element of policyElement.elements) {
                const { text } = tryExecuteFieldValue(element.elements[0], executionContext);
                if (text === header) {
                    authorised = !authorised;
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
     * Validates host filter policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errorMessage = get(policyElement, 'attributes.failed-check-error-message');
        const httpCode = get(policyElement, 'attributes.failed-check-httpcode');
        const hostFilter = get(policyElement, 'attributes.action');
        const errors = [];
        if (!errorMessage) {
            errors.push(`${this.id}-ERR-001: attribute 'failed-check-error-message' is required`);
        }
        if (!httpCode || isNaN(Number.parseInt(httpCode))) {
            errors.push(`${this.id}-ERR-002: attribute 'failed-check-httpcode' is required and should be integer`);
        }
        if (!hostFilter || (['allow', 'forbid'].indexOf(hostFilter) === -1)) {
            errors.push(`${this.id}-ERR-003: attribute 'action' is required, or should be either allow or forbid`);
        }
        if(!policyElement.elements || !policyElement.elements.length) {
            errors.push(`${this.id}-ERR-004: at least one host should be defined for policy`);
        }
        return errors;
    }
}