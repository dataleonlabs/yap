import { get, unset } from 'lodash';
import { ExecutionContext, IPolicy, PolicyCategory, Scope, tryExecuteFieldValue } from '../index';

/**
 * set-query-parameter Policy
 * The set-query-parameter policy adds, replaces value of, or
 * deletes request query string parameter. Can be used to pass query parameters expected
 * by the backend service which are optional or never present in the request.
 * @example
 * <set-query-parameter name="param name" exists-action="override | skip | append | delete">
 *     <value>value</value> <!--for multiple parameters with the same name add additional value elements-->
 * </set-query-parameter>
 *
 * <set-query-parameter>
 *  <parameter name="api-key" exists-action="skip">
 *    <value>12345678901</value>
 *  </parameter>
 *  <!-- for multiple parameters with the same name add additional value elements -->
 * </set-query-parameter>
 */
export default class SetQueryParameter implements IPolicy {

    /**
     * Policy id
     */
    public get id() {
        return 'set-query-parameter';
    }

    /**
     * Policy name
     */
    public get name() {
        return 'Set query parameter policy';
    }

    /**
     * Policy category
     */
    public get category() {
        return PolicyCategory.transformation;
    }

    /**
     * Policy description
     */
    public get description() {
        return "The set-query-parameter policy adds, replaces value of, or deletes request query string parameter. Can be used to pass query parameters expected";
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
     * Applies set query parameters policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        policyElement.elements.forEach((element: any) => {
            const queryParam: any = {};
            if (element.name === "parameter") {
                element.elements.forEach((param: any) => {
                    const queryKey: any = (element.attributes.name as { [key: string]: any });
                    queryParam[queryKey] = tryExecuteFieldValue(get(param, 'elements[0].text'), executionContext);
                    if (element.attributes['exists-action'] === "override") {
                        context.request.queryStringParameters = queryParam;
                    } else if (element.attributes['exists-action'] === "append") {
                        context.request.queryStringParameters = { ...context.request.queryStringParameters, ...queryParam };
                    } else if (element.attributes['exists-action'] === "delete") {
                        unset(context, `request.queryStringParameters.${queryKey}`);
                    } else {
                    }
                });
            }
        });
        return executionContext;
    }

    /**
     * Validates set query parameters policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        if (!policyElement.elements || !policyElement.elements.length) {
            errors.push(`${this.id}-ERR-001: Should be at least one <parameter/> in child elements"`);
        } else {
            for (const element of policyElement.elements) {
                const name = get(element, 'attributes.name');
                if (!name) {
                    errors.push(`${this.id}-ERR-002: Name attribute should be set. For example name="WWW-Authenticate"`);
                } else {
                    if (!element.elements || !element.elements.length) {
                        errors.push(`${this.id}-ERR-003: At least one of value of query parameter should be set for node <${element.name}>. Example <value>Bearer error="invalid_token"</value>`);
                    }
                }
            }
        }
        return errors;
    }
}