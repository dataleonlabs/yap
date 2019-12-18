import { Context } from "../../router";

/**
 * rate-limit-by-key policy prevents API usage spikes on a per-key basis by limiting the call
 * rate to a specified number per a specified time period.
 * The key can have an arbitrary string value and is typically provided using a policy expression.
 * Optional increment condition can be added to specify which requests should be counted towards the limit.
 * When this policy is triggered the caller receives a 429 Too Many Requests response status code.
 *
 * <rate-limit-by-key calls="number"
 *                    renewal-period="seconds"
 *                    increment-condition="condition"
 *                    counter-key="key value" />
 * @example
 * <policies>
 *   <inbound>
 *       <base />
 *       <rate-limit-by-key  calls="10"
 *             renewal-period="60"
 *             increment-condition="@(context.response.statusCode == 200)"
 *             counter-key="@(context.request.ipAddress)"/>
 *   </inbound>
 *   <outbound>
 *       <base />
 *   </outbound>
 *  </policies>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};