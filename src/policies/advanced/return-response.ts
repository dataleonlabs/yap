import { Context } from "../../router";
import policyManager, { ExecutionContext, IPolicy } from "../index";
const allowedPolicies = ["set-status", "set-header", "set-body"];

export default class ReturnResponse implements IPolicy {

    public get id() {
        return 'return-response';
    }

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
public async apply(executionContext:ExecutionContext) {
        let { policyElement, context, scope } = executionContext;
        for (const element of policyElement.elements) {
            if (allowedPolicies.indexOf(element.name) > -1) {
                const policy = policyManager.getPolicy(element.name);
                const appliedResult: any = await policy.apply({policyElement: element, context, scope: 'inbound'});
                context = appliedResult.context;
            }
        }
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}