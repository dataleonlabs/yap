import { Context } from "../../Router";

/**
 * authentication-basic policy
 * Use the authentication-basic policy to authenticate with a backend
 * service using Basic authentication. This policy effectively sets
 * the HTTP Authorization header to the
 * value corresponding to the credentials provided in the policy.
 * @example
 * <authentication-basic username="username" password="password" />
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    if(policyElement.name=="authentication-basic"){
        if(policyElement.attributes.username && policyElement.attributes.password){
            context.response.body = "Request is valid"
        } else{
            context.response.body = "Request is not valid"
        }
    }
    return { policyElement, context, scope };
};