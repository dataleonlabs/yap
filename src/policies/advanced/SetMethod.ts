import { get } from 'lodash';
import { Context } from "../../router";
import { tryExecuteFieldValue } from "../index";
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

/**
 * set-method policy
 * The set-method policy allows you to change the HTTP request method for a request.
 * @example
 * <set-method>POST</set-method>
 */
@YapPolicy({
    id: 'set-method',
    name: 'Set method policy',
    category: PolicyCategory.advanced,
    description: "The set-method policy allows you to change the HTTP request method for a request.",
    scopes: [Scope.inbound, Scope.onerror],
  })
export default class SetMethod extends Policy {

    /**
     * Applies set method policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        context.request.httpMethod = tryExecuteFieldValue(get(policyElement, 'elements[0].text'), executionContext);
        return executionContext;
    }

    /**
     * Validates set method policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        const method = get(policyElement, 'elements[0].text');
        if (['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'].indexOf(method) === -1) {
            errors.push(`${this.id}-ERR-001: method name should be set and equals one of `
            +`'GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE. Example <set-method>POST</set-method>`);
        }
        return errors;
    }
}