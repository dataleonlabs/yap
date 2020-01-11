import { get, set } from "lodash";
import policyManager from "..";
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from "../policy";
const allowedPolicies = ["set-status", "set-header", "set-body"];

/**
 * return-response
 * The return-response policy aborts pipeline execution and returns either a
 * default or custom response to the caller. Default response is 200 OK with no body.
 * Custom response can be specified via a context variable or policy statements.
 * When both are provided, the response contained within the context variable is
 * modified by the policy statements before being returned to the caller.
 * @example
 * <return-response response-variable-name="existing context variable">
 *   <set-header/>
 *   <set-body/>
 *   <set-status/>
 * </return-response>
 * @example
 * <return-response>
 *    <set-status code="401" reason="Unauthorized"/>
 *    <set-header name="WWW-Authenticate" exists-action="override">
 *       <value>Bearer error="invalid_token"</value>
 *    </set-header>
 * </return-response>
 *
 */
@YapPolicy({
    id: 'return-response',
    name: 'Return response policy',
    category: PolicyCategory.advanced,
    description: "The return-response policy aborts pipeline execution and returns either a default or custom response to the caller.",
    scopes: [Scope.inbound, Scope.outbound, Scope.onerror],
  })
export default class ReturnResponse extends Policy {

    /**
     * Applies return response policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        let { context } = executionContext;
        const { policyElement, scope } = executionContext;
        const responseVariableName = get(policyElement, 'attributes.response-variable-name');
        for (const element of policyElement.elements) {
            if (allowedPolicies.indexOf(element.name) > -1) {
                const policy = policyManager.getPolicy(element.name);
                if (responseVariableName) {
                    set(policy, 'attributes.response-variable-name', responseVariableName);
                }
                const appliedResult: any = await policy.apply({ policyElement: element, context, scope });
                context = appliedResult.context;
            }
        }
        return executionContext;
    }

    /**
     * Validates return response policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        let errors: string[] = [];
        const elements = policyElement.elements;
        if (!elements.length) {
            errors.push(`${this.id}-ERR-001: return-response should have at least one element of <set-header> <set-body> or <set-status>`);
        } else {
            for (const element of elements) {
                switch (element.name) {
                    case 'set-header':
                    case 'set-body':
                    case 'set-status':
                        const policyInstance = policyManager.getPolicy(element.name);
                        const policyErrors = policyInstance.validate(element);
                        if (policyErrors.length) {
                            errors = [...errors, ...policyErrors];
                        }
                        break;
                    default:
                        errors.push(`${this.id}-ERR-002: XML tag <${this.id}> contains policy <${element.name}>. `
                        +`Only <set-header> <set-body> or <set-status> allowed`);
                        break;
                }
            }
        }
        return errors;
    }
}