import { Context } from "../../router";

/**
 * Domain Filter Policy
 * @example
 * <host-filter action="allow">
 *     <host>13.66.201.169</host>
 * </host-filter>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};