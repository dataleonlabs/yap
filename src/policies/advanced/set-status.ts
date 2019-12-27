import { get, set } from "lodash";
import { Context } from "../../router";
import { ExecutionContext, IPolicy, PolicyCategory, Scope } from "../index";

/**
 * set-status policy
 * The set-status policy sets the HTTP status code to the specified value.
 * @example
 * <set-status code="401" reason="Unauthorized" response-variable-name="someVar"/>
 */
export default class SetStatus implements IPolicy {

    /**
     * Policy id
     */
    public get id() {
        return 'set-status';
    }

    /**
     * Policy name
     */
    public get name() {
        return 'Set status policy';
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
        return "Set status policy sets the HTTP status code to the specified value.";
    }

    /**
     * Policy available scopes
     */
    public get scopes() {
        return [Scope.outbound, Scope.onerror];
    }

    /**
     * If policy is YAP internal policy
     */
    public get isInternal() {
        return true;
    }

    /**
     * Applies set status policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const responseVariableName = get(policyElement, 'attributes.response-variable-name');
        const setBodyPath = responseVariableName ? `fields.${responseVariableName}` : 'response';
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