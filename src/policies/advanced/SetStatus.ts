import { get, set } from "lodash";
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from "../policy";

/**
 * set-status policy
 * The set-status policy sets the HTTP status code to the specified value.
 * @example
 * <set-status code="401" reason="Unauthorized" response-variable-name="someVar"/>
 */
@YapPolicy({
    id: 'set-status',
    name: 'Set status policy',
    category: PolicyCategory.advanced,
    description: "Set status policy sets the HTTP status code to the specified value.",
    scopes: [Scope.outbound, Scope.onerror],
  })
export default class SetStatus extends Policy {

    /**
     * Applies set status policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const responseVariableName = get(policyElement, 'attributes.response-variable-name');
        const setBodyPath = responseVariableName ? `variables.${responseVariableName}` : 'response';
        set(context, `${setBodyPath}.statusCode`, policyElement.attributes.reason);
        context.response.statusCode = policyElement.attributes.code;
        if (policyElement.attributes.reason) {
            set(context, `${setBodyPath}.body`,  policyElement.attributes.reason);
        }
        return executionContext;
    }

    /**
     * Validates set status policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        const code = get(policyElement, 'attributes.code');
        const reason = get(policyElement, 'attributes.reason');
        if (isNaN(Number.parseInt(code))) {
            errors.push(`${this.id}-ERR-001: code should be set in attributes, for example code="401"`);
        }
        if(!reason) {
            errors.push(`${this.id}-ERR-002: reason should be set in attributes, for example reason="Unauthorized"`);
        }
        return errors;
    }
}