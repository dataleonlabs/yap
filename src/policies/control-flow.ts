import { Context } from "../Router";

/**
 * control-flow policy
 * The choose policy applies enclosed policy statements based on the outcome
 * of evaluation of Boolean expressions, similar to an if-then-else
 * or a switch construct in a programming language.
 *
 * The control flow policy must contain at least one <when/> element.
 * The <otherwise/> element is optional. Conditions in <when/> elements
 * are evaluated in order of their appearance within the policy.
 * Policy statement(s) enclosed within the first <when/> element
 * with condition attribute equals true will be applied.
 * Policies enclosed within the <otherwise/> element, if present,
 * will be applied if all of the <when/> element condition attributes are false.
 *
 * @example
 * <choose>
 *  <when condition="Boolean expression | Boolean constant">
 *      <!— one or more policy statements to be applied if the above condition is true  -->
 *  </when>
 *  <when condition="Boolean expression | Boolean constant">
 *      <!— one or more policy statements to be applied if the above condition is true  -->
 *  </when>
 *  <otherwise>
 *      <!— one or more policy statements to be applied if none of the above conditions are true  -->
 *  </otherwise>
 * </choose>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    return { policyElement, context, scope };
};