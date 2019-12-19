import { get } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from "../index";

export default class RewritePath implements IPolicy {

    public get id() {
        return 'rewrite-path';
    }

    /**
     * rewrite-path policy
     * The rewrite-path policy converts a request Path from its public form to the form expected
     * by the web service, as shown in the following example.
     * @example
     * <rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        context.request.path = tryExecuteFieldValue(get(policyElement, 'elements[0].text'), executionContext);
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}