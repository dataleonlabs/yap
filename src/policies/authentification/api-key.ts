import { get } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from "../index";

export default class ApiKey implements IPolicy {

    public get id() {
        return 'api-key';
    }

    /**
     * api-key-filter Policy
     * Check on Authorization
     * @example
     * <api-key failed-check-httpcode="401" failed-check-error-message="Not authorized">
     *     <value>13.66.201.169</value>
     * </api-key>
     *
     * @test
     * U-TEST-1 - Test API Key Success
     * U-TEST-2 - Test API Key Failed
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        let authorised = false;
        const header = get(context,`request.requestContext.headers.api-key`);
        if(header && policyElement.elements && policyElement.elements) {
            for (const element of policyElement.elements) {
                const { text } = tryExecuteFieldValue(element.elements[0], executionContext);
                if(text === header) {
                    authorised = !authorised;
                    break;
                }
            }
        }
        if (!authorised) {
            context.response.statusCode = policyElement.attributes["failed-check-httpcode"];
            context.response.body = policyElement.attributes["failed-check-error-message"];
        }
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}