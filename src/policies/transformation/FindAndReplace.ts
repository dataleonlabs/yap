import { get, set } from 'lodash';
import { ExecutionContext, Policy, PolicyCategory, Scope, YapPolicy } from '../../';

/**
 * set-varable policy
 * The find-and-replace policy copies value from one path to another,
 * in request or response objects
 * from and ot attributes showed path in a dot notation
 * @example
 * <find-and-replace from="field.subfield1" to="field.subfield2" />
 */
@YapPolicy({
    id: 'find-and-replace',
    name: 'Find and replace policy',
    category: PolicyCategory.transformation,
    description: "Applies find and replace policy for body parameter in dot notation",
    scopes: [Scope.inbound, Scope.outbound, Scope.onerror],
  })
export default class FindAndReplace extends Policy {

    /**
     * Applies find and replace policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const containerObject = scope === 'inbound' ? context.request.body : context.response.body;
        const fromValue = get(containerObject, policyElement.attributes.from);
        set(containerObject, policyElement.attributes.to, fromValue);
        return executionContext;
    }

    /**
     * Validates find and replace policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        const from = get(policyElement, 'attributes.from');
        const to = get(policyElement, 'attributes.to');
        if (!from) {
            errors.push(`${this.id}-ERR-001: attribute 'from' is required`);
        }
        if (!to) {
            errors.push(`${this.id}-ERR-002: attribute 'to' is required`);
        }
        return errors;
    }
}