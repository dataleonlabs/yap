import { Context } from "../../router";

/**
 * <send-request> policy sends the provided request to the specified URL, waiting no longer than the set timeout value.
 * @example
 * <send-request mode="new|copy" response-variable-name="" timeout="60 sec" ignore-error="false|true">
 *  <set-url>...</set-url>
 *  <set-method>...</set-method>
 *  <set-header name="" exists-action="override|skip|append|delete">...</set-header>
 *  <set-body>...</set-body>
 *  <authentication-certificate thumbprint="thumbprint" />
 * </send-request>
 *
 * <!-- Send request to Token Server to validate token (see RFC 7662) -->
 * <send-request mode="new" response-variable-name="tokenstate" timeout="20" ignore-error="true">
 *   <set-url>https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection</set-url>
 *   <set-method>POST</set-method>
 *   <set-header name="Authorization" exists-action="override">
 *     <value>basic dXNlcm5hbWU6cGFzc3dvcmQ=</value>
 *   </set-header>
 *   <set-header name="Content-Type" exists-action="override">
 *     <value>application/x-www-form-urlencoded</value>
 *   </set-header>
 *   <set-body>@($"token={(string)context.variables["token"]}")</set-body>
 * </send-request>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};