import { get } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, PolicyCategory, Scope, tryExecuteFieldValue } from "../index";

/**
 * set-method policy
 * The set-method policy allows you to change the HTTP request method for a request.
 * @example
 * <set-method>POST</set-method>
 */
export default class SetMethod implements IPolicy {

    /**
     * Policy id
     */
    public get id() {
        return 'set-method';
    }

    /**
     * Policy name
     */
    public get name() {
        return 'Set method policy';
    }

    /**
     * Policy category
     */
    public get category() {
        return PolicyCategory.advanced;
    }

    /**
     * Policy description
     */
    public get description() {
        return "The set-method policy allows you to change the HTTP request method for a request.";
    }

    /**
     * Policy available scopes
     */
    public get scopes() {
        return [Scope.inbound, Scope.onerror];
    }

    /**
     * If policy is YAP internal policy
     */
    public get isInternal() {
        return true;
    }

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
            errors.push(`${this.id}-ERR-001: method name should be set and equals one of 'GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE. Example <set-method>POST</set-method>`);
        }
        return errors;
    }
}