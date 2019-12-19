import { get } from "lodash";
import { Context } from "../../router";
import policyManager, { ExecutionContext, IPolicy, tryExecuteFieldValue } from "../index";

export default class ControlFlow implements IPolicy {

    public get id() {
        return 'control-flow';
    }

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
    public async apply(executionContext: ExecutionContext) {
        let { policyElement, context, scope } = executionContext;
        let conditionWasExecuted = false;
        for (const controlElement of policyElement.elements) {
            if (controlElement.name === "when" || (controlElement.name === "otherwise" && !conditionWasExecuted)) {
                const condition = get(controlElement, 'attributes.condition', true);
                if ((condition === true) || (tryExecuteFieldValue(condition, executionContext) === true)) {
                    for(const policy of controlElement.elements) {
                        const appliedContext:ExecutionContext = await policyManager.apply({policyElement: policy, context, scope});
                        context = appliedContext.context;
                    }
                    conditionWasExecuted = true;
                }
            }
        }
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}