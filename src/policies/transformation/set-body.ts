import { get } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from "../index";

export default class SetBody implements IPolicy {

    public get id() {
        return 'set-body';
    }

    /**
     * set-body policy
     * Use the set-body policy to set the message body for incoming and outgoing requests.
     * To access the message body you can use the context.Request.Body property
     * or the context.Response.Body, depending on whether the policy is in the inbound or
     * outbound section.
     * @example
     * <set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        context.request.body = tryExecuteFieldValue(get(policyElement, 'elements[0].text'), executionContext);
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}