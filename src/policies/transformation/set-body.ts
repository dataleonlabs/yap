import { get, set } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, PolicyCategory, Scope, tryExecuteFieldValue } from "../index";

/**
 * set-body policy
 * Use the set-body policy to set the message body for incoming and outgoing requests.
 * To access the message body you can use the context.Request.Body property
 * or the context.Response.Body, depending on whether the policy is in the inbound or
 * outbound section.
 * @example
 * <set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>
 */
export default class SetBody implements IPolicy {

    /**
     * Policy id
     */
    public get id() {
        return 'set-body';
    }

    /**
     * Policy name
     */
    public get name() {
        return 'Set body policy';
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
        return "Use the set-body policy to set the message body for incoming and outgoing requests.";
    }

    /**
     * Policy available scopes
     */
    public get scopes() {
        return [Scope.outbound, Scope.inbound, Scope.onerror];
    }

    /**
     * If policy is YAP internal policy
     */
    public get isInternal() {
        return true;
    }

    /**
     * Applies set body policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const responseVariableName = get(policyElement, 'attributes.response-variable-name');
        const setBodyPath = responseVariableName
            ? `fields.${responseVariableName}`
            : scope === Scope.inbound
                ? 'request.body'
                : 'response.body';
        set(context, setBodyPath, tryExecuteFieldValue(get(policyElement, 'elements[0].text'), executionContext));
        return executionContext;
    }

    /**
     * Validates set body policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        const body = get(policyElement, 'elements[0].text');
        if (!body) {
            errors.push(`${this.id}-ERR-001: Body should be set as policy body. For example, <set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>`);
        }
        return errors;
    }
}