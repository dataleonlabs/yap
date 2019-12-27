import { get, set } from 'lodash';
import { ExecutionContext, PolicyCategory, Scope } from '..';
import { Context } from "../../router";

/**
 * set-varable policy
 * The find-and-replace policy copies value from one path to another,
 * in request or response objects
 * from and ot attributes showed path in a dot notation
 * @example
 * <find-and-replace from="field.subfield1" to="field.subfield2" />
 */
export default class FindAndReplace {

    /**
     * Policy id
     */
    public get id() {
        return 'find-and-replace';
    }

    /**
     * Policy name
     */
    public get name() {
        return 'Find and replace policy';
    }

    /**
     * Policy category
     */
    public get category() {
        return PolicyCategory.transformation;
    }

    /**
     * Policy description
     */
    public get description() {
        return "Applies find and replace policy for body parameter in dot notation";
    }

    /**
     * Policy available scopes
     */
    public get scopes() {
        return [Scope.inbound, Scope.outbound, Scope.onerror];
    }

    /**
     * If policy is YAP internal policy
     */
    public get isInternal() {
        return true;
    }

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