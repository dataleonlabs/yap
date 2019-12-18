import { Context } from "../../Router";

/**
 * set-status policy
 * The set-status policy sets the HTTP status code to the specified value.
 * @example
 * <set-status code="401" reason="Unauthorized"/>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    if(policyElement.name=="set-status"){
        context.response.statusCode = policyElement.attributes.code;
        if(policyElement.attributes.reason){
            context.response.body = policyElement.attributes.reason;
        }
    }
    // if reason is mentioned then append to body else don't
    return { policyElement, context, scope };
};