import { Context } from "../../router";

/**
 * rewrite-path policy
 * The rewrite-path policy converts a request Path from its public form to the form expected
 * by the web service, as shown in the following example.
 * @example
 * <rewrite-path>/services/T0DCUJB1Q/B0DD08H5G/bJtrpFi1fO1JMCcwLx8uZyAg</rewrite-path>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    if(policyElement.name=="rewrite-path") {
        policyElement.elements.forEach((element:any) => {
            context.request.path = element.text;
        });
    }
    return { policyElement, context, scope };
};