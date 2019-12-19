import {get } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from "../index";

export default class SetMethod implements IPolicy {

    public get id() {
        return 'set-method';
    }

    /**
     * set-method policy
     * The set-method policy allows you to change the HTTP request method for a request.
     * @example
     * <set-method>POST</set-method>
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        context.request.httpMethod = tryExecuteFieldValue(get(policyElement, 'elements[0].text'), executionContext);
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}