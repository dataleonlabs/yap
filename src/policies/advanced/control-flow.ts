import { get } from "lodash";
import { Context } from "../../router";
import policyManager, { ExecutionContext, IPolicy, PolicyCategory, Scope, tryExecuteFieldValue } from "../index";

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
export default class ControlFlow implements IPolicy {

    /**
     * Policy id
     */
    public get id() {
        return 'control-flow';
    }

    /**
     * Policy name
     */
    public get name() {
        return 'Control flow policy';
    }

    /**
     * Policy category
     */
    public get category() {
        return PolicyCategory.advanced;
    }

    /**
     * Policy description
     */
    public get description() {
        return "The control-flow policy applies enclosed policy statements based on the outcome";
    }

    /**
     * Policy available scopes
     */
    public get scopes() {
        return [Scope.inbound, Scope.outbound, Scope.onerror];
    }

    /**
     * If policy is YAP internal policy
     */
    public get isInternal() {
        return true;
    }

    /**
     * Applies control flow policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        let { context } = executionContext;
        const { policyElement, scope } = executionContext;
        let conditionWasExecuted = false;
        for (const controlElement of policyElement.elements) {
            if (controlElement.name === "when" || (controlElement.name === "otherwise" && !conditionWasExecuted)) {
                const condition = get(controlElement, 'attributes.condition', true);
                if ((condition === true) || (tryExecuteFieldValue(condition, executionContext) === true)) {
                    for (const policy of controlElement.elements) {
                        const appliedContext: ExecutionContext = await policyManager.apply({ policyElement: policy, context, scope });
                        context = appliedContext.context;
                    }
                    conditionWasExecuted = true;
                }
            }
        }
        return executionContext;
    }

    /**
     * Validates control flow policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const elements = get(policyElement, 'elements');
        let errors = [];
        if (!elements || !elements.length || get(elements, '[0].name') !== 'when') {
            errors.push(`${this.id}-ERR-001: Control flow should have at least one element of <when>, <otherwise> should be after`);
        }
        for (const element of elements) {
            switch (element.name) {
                case "when":
                    if (!get(element, 'attributes.condition')) {
                        errors.push(`${this.id}-ERR-003: <when> should have condition attribute`);
                    }
                case "otherwise":
                    if (!element.elements || !element.elements.length) {
                        errors.push(`${this.id}-ERR-004: <when>, <otherwise> should have children elements of policy types`);
                    } else {
                        for (const subElement of element.elements) {
                            const policyInstance = policyManager.getPolicy(subElement.name);
                            if (!policyInstance) {
                                errors.push(`policies-ERR-005: XML tag <${element.name}> contains unknown policy <${subElement.name}>. Please, load definition for this policy before loading of XML`);
                            } else {
                                const policyInstanceErrors = policyInstance.validate(subElement);
                                if (policyInstanceErrors.length) {
                                    errors = [...errors, ...policyInstanceErrors];
                                }
                            }
                        }
                    }
                    break;
                default:
                    errors.push(`${this.id}-ERR-002: Element <${element.name}> is forbiden. Should be <when> or <otherwise> only`);
                    break;
            }
        }
        return errors;
    }
}