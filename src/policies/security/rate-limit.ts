import { Context } from "../../router";

/**
 * rate-limit policy
 * The rate-limit-by-key policy prevents API usage spikes
 * by limiting the call rate to a specified number per a specified time period.
 * @example
 * <rate-limit calls="20" renewal-period="90" />
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};