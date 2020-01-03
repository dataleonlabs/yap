import { get } from 'lodash';
import { Context } from "../../router";
import { tryExecuteFieldValue } from "../index";
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

/**
 * rewrite-path policy
 * The rewrite-path policy converts a request Path from its public form to the form expected
 * by the web service, as shown in the following example.
 * @example
 * <rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>
 */
@YapPolicy({
    id: 'rewrite-path',
    name: 'Rewrite path policy',
    category: PolicyCategory.transformation,
    description: "The rewrite-path policy converts a request Path from its public form to the form expected",
    scopes: [Scope.inbound, Scope.onerror, Scope.outbound],
  })
export default class RewritePath extends Policy {

    /**
     * Applies rewrite path policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        context.request.path = tryExecuteFieldValue(get(policyElement, 'elements[0].text'), executionContext);
        return executionContext;
    }

    /**
     * Validates rewrite path policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        const path = get(policyElement, 'elements[0].text');
        if (!path) {
            errors.push(`${this.id}-ERR-001: Path should be set as policy body. For example, <rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>`);
        }
        return errors;
    }
}