import * as axios from 'axios';
import { get, set } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy } from "../index";
import policyManager from '../index';

const allowedPolicies = ["set-method", "set-header", "set-body"];

const defaultRequest = {
    body: '',
    headers: {},
    httpMethod: 'GET',
};

export default class SendRequest implements IPolicy {

    public get id() {
        return 'send-request';
    }

    /**
     * <send-request> policy sends the provided request to the specified URL, waiting no longer than the set timeout value.
     * @example
     * <send-request mode="new|copy" response-variable-name="" timeout="60 sec" ignore-error="false|true">
     *  <set-url>...</set-url>
     *  <set-method>...</set-method>
     *  <set-header name="" exists-action="override|skip|append|delete">...</set-header>
     *  <set-body>...</set-body>
     * </send-request>
     *
     * <!-- Send request to Token Server to validate token (see RFC 7662) -->
     * <send-request mode="new" response-variable-name="tokenstate" timeout="20" ignore-error="true">
     *   <set-url>https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection</set-url>
     *   <set-method>POST</set-method>
     *   <set-header name="Authorization" exists-action="override">
     *     <value>basic dXNlcm5hbWU6cGFzc3dvcmQ=</value>
     *   </set-header>
     *   <set-header name="Content-Type" exists-action="override">
     *     <value>application/x-www-form-urlencoded</value>
     *   </set-header>
     *   <set-body>@($"token={(string)context.variables["token"]}")</set-body>
     * </send-request>
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        //"X-Client-Cert"
        let operationalContext = null;
        let requestUrl = "";
        operationalContext = { ...context };
        if (policyElement.attributes.mode === "new") {
            operationalContext.request = { ...defaultRequest };
            if (scope === 'outbound') {
                operationalContext.request.body = null;
            }
        }
        for (const element of policyElement.elements) {
            if (element.name === "set-url") {
                requestUrl = get(element, 'elements[0].text');
            }
            if (allowedPolicies.indexOf(element.name) > -1) {
                const policy = policyManager.getPolicy(element.name);
                const appliedResult:any = await policy.apply({ policyElement: element, context: operationalContext, scope: 'inbound'});
                operationalContext = appliedResult.context;
            }
        }
        const options = {
            url: requestUrl,
            method: operationalContext.request.httpMethod,
            headers: operationalContext.request.headers,
            data: operationalContext.request.body,
            timeout: policyElement.attributes.timeout ? Number(policyElement.attributes.timeout) : undefined,
        };
        try {
            const response = await axios.default.request(options);
            if (policyElement.attributes['response-variable-name']) {
                set(context, `variables[${policyElement.attributes['response-variable-name']}]`, response.data);
            }
        } catch (e) {
            if (policyElement.attributes['ignore-error'] === "true") {
                if (policyElement.attributes['response-variable-name']) {
                    set(context, `variables[${policyElement.attributes['response-variable-name']}]`, null);
                }
            } else {
                throw e;
            }
        }
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}