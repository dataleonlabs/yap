import { Context } from "../../Router";

/**
 * Check Header Policy
 * Use the check-header policy to enforce that a request has a specified HTTP header.
 * You can optionally check to see if the header has a specific value or check
 * for a range of allowed values. If the check fails, the policy terminates request processing and returns the
 * HTTP status code and error message specified by the policy.
 * @example
 * <check-header name="header name" failed-check-httpcode="code" failed-check-error-message="message" ignore-case="true">
 *     <value>Value1</value>
 *     <value>Value2</value>
 * </check-header>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};