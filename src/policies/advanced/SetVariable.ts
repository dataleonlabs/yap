import { get, set } from 'lodash';
import { tryExecuteFieldValue } from '../index';
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

/**
 * set-varable policy
 * The set-variable policy declares a context variable and assigns
 * it a value specified via an expression or a string literal.
 * if the expression contains a literal it will be converted to a string
 * and the type of the value will be System.String.
 * @example
 * <set-variable name="variable name" value="Expression | String literal" />
 */
@YapPolicy({
    id: 'set-variable',
    name: 'Set variable policy',
    category: PolicyCategory.advanced,
    description: "The set-variable policy declares a context variable and assigns",
    scopes: [Scope.inbound, Scope.outbound, Scope.onerror],
  })
export default class SetVariable extends Policy {

    /**
     * Applies set variable policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        set(context, `variables.${policyElement.attributes.name}`, tryExecuteFieldValue(policyElement.attributes.value, executionContext));
        return executionContext;
    }

    /**
     * Validates set variable policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        const name = get(policyElement, 'attributes.name');
        const value = get(policyElement, 'attributes.value');
        if(!value) {
            errors.push(`${this.id}-ERR-001: value should be set in attributes, for example value="true"`);
        }
        if(!name) {
            errors.push(`${this.id}-ERR-002: name should be set in attributes, for example name="isBackend"`);
        }
        return errors;
    }
}