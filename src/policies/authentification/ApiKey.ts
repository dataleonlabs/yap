import { get } from 'lodash';
import { tryExecuteFieldValue } from "../index";
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

/**
 * api-key Policy
 * Check on Authorization
 * @example
 * <api-key failed-check-httpcode="401" failed-check-error-message="Not authorized">
 *     <value>13.66.201.169</value>
 * </api-key>
 *
 * @test
 * U-TEST-1 - Test API Key Success
 * U-TEST-2 - Test API Key Failed
 */
@YapPolicy({
    id: 'api-key',
    name: 'Api key Policy',
    category: PolicyCategory.authentification,
    description: "Api key Policy authenticate with a backend service with an api key",
    scopes: [Scope.inbound],
  })
export default class ApiKey extends Policy {

    /**
     * Applies api key policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        let authorised = false;
        const header = get(context, `request.requestContext.headers.api-key`);
        if (header && policyElement.elements && policyElement.elements) {
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
            throw new Error("API Key not authorized");
        }
        return executionContext;
    }

    /**
     * Validates api key policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errorMessage = get(policyElement, 'attributes.failed-check-error-message');
        const httpCode = get(policyElement, 'attributes.failed-check-httpcode');
        const errors = [];
        if (!errorMessage) {
            errors.push(`${this.id}-ERR-001: attribute 'failed-check-error-message' is required`);
        }
        if (!httpCode || isNaN(Number.parseInt(httpCode))) {
            errors.push(`${this.id}-ERR-002: attribute 'failed-check-httpcode' is required and should be integer`);
        }
        if(!policyElement.elements || !policyElement.elements.length) {
            errors.push(`${this.id}-ERR-003: at least one api-key should be defined for policy`);
        }
        return errors;
    }
}