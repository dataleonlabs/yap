import { Context } from "../../router";

/**
 * set-method policy
 * The set-method policy allows you to change the HTTP request method for a request.
 * @example
 * <set-method>METHOD</set-method>
 * <set-method>POST</set-method>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    if(policyElement.name=="set-method") {
        policyElement.elements.forEach((element:any) => {
            context.request.httpMethod = element.text;
        });
    }
    return { policyElement, context, scope };
};