import { unset } from 'lodash';
import { get } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from '../index';

export default class SetQueryParameter implements IPolicy {

    public get id() {
        return 'set-query-parameter';
    }

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
public async apply(executionContext:ExecutionContext) {
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

    public validate(policyElement: any) {
        return true;
    }
}