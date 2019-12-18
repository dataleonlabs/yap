import { Context } from "../../Router";

/**
 * api-key-filter Policy
 * Check on Authorization
 * @example
 * <api-key>
 *     <value>13.66.201.169</value>
 * </api-key>
 *
 * @test
 * U-TEST-1 - Test API Key Success
 * U-TEST-2 - Test API Key Failed
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};