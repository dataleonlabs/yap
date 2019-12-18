import { Context } from "../../router";

/**
 * set-body policy
 * Use the set-body policy to set the message body for incoming and outgoing requests.
 * To access the message body you can use the context.Request.Body property
 * or the context.Response.Body, depending on whether the policy is in the inbound or
 * outbound section.
 * @example
 * <set-body>bJtrpFi1fO1JMCcwLx8uZyAg</set-body>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    policyElement.elements.forEach((element:any) => {
        if(policyElement.name=="set-body"){
            context.response.body = element.text;
        }
    })
    return { policyElement, context, scope };
};