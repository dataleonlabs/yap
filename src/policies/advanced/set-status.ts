import { Context } from "../../router";
import { ExecutionContext, IPolicy } from "../index";

export default class SetStatus implements IPolicy {

    public get id() {
        return 'set-status';
    }

    /**
     * set-status policy
     * The set-status policy sets the HTTP status code to the specified value.
     * @example
     * <set-status code="401" reason="Unauthorized"/>
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        context.response.statusCode = policyElement.attributes.code;
        if (policyElement.attributes.reason) {
            context.response.body = policyElement.attributes.reason;
        }
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}