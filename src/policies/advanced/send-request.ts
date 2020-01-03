import * as axios from 'axios';
import { cloneDeep, get, set } from 'lodash';
import { Context } from "../../router";
import policyManager from "../index";
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

const allowedPolicies = ["set-method", "set-header", "set-body"];

const defaultRequest = {
    body: '',
    headers: {},
    httpMethod: 'GET',
};

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
@YapPolicy({
    id: 'send-request',
    name: 'Send request policy',
    category: PolicyCategory.advanced,
    description: "Send request policy sends the provided request to the specified URL, waiting no longer than the set timeout value.",
    scopes: [Scope.inbound, Scope.onerror],
  })
export default class SendRequest extends Policy {

    /**
     * Applies send request policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        //"X-Client-Cert"
        let operationalContext = null;
        let requestUrl = "";
        operationalContext = cloneDeep(context);
        if (policyElement.attributes.mode === "new") {
            operationalContext.request = cloneDeep(defaultRequest);
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
                const appliedResult: any = await policy.apply({ policyElement: element, context: operationalContext, scope: Scope.inbound });
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

    /**
     * Validates send request policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        let errors: string[] = [];
        const variableName = get(policyElement, 'attributes.response-variable-name');
        const checkSubElements = (element: any) => {
            const policyInstance = policyManager.getPolicy(element.name);
            if (!policyInstance) {
                errors.push(`policies-ERR-005: XML tag <${policyElement.name}> contains unknown policy <${element.name}>. Please, load definition for this policy before loading of XML`);
            } else {
                const policyInstanceErrors = policyInstance.validate(element);
                if (policyInstanceErrors.length) {
                    errors = [...errors, ...policyInstanceErrors];
                }
            }
        };
        if (!variableName) {
            errors.push(`${this.id}-ERR-001: response-variable-name attribute should be set`);
        }
        if (!policyElement.elements || !policyElement.elements.length) {
            errors.push(`${this.id}-ERR-002: Should be one of the following elements as childs: <set-url>, <set-method>, <set-header>, <set-body>`);
        } else {
            let setUrlPersist = false;
            let setMethodPersist = false;
            for (const element of policyElement.elements) {
                switch (element.name) {
                    case 'set-url':
                        setUrlPersist = true;
                        break;
                    case 'set-method':
                        setMethodPersist = true;
                        checkSubElements(element);
                        break;
                    case 'set-header':
                        checkSubElements(element);
                        break;
                    case 'set-body':
                        checkSubElements(element);
                        break;
                    default:
                        errors.push(`${this.id}-ERR-005: policy <${element.name}> not allowed here. Allowed only <set-url>, <set-method>, <set-header>, <set-body>`);
                        break;
                }
            }
            if (get(policyElement, 'attributes.mode') === 'new') {
                if (!setUrlPersist) {
                    errors.push(`${this.id}-ERR-003: Should contain XML tag <set-url> if mode is new`);
                }
                if (!setMethodPersist) {
                    errors.push(`${this.id}-ERR-004: Should contain XML tag <set-method> if mode is new`);
                }
            }
        }
        return errors;
    }
}