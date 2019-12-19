import { get } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from "../index";

export default class HostFilter implements IPolicy  {

    public get id() {
        return 'host-filter';
    }

    /**
     * Domain Filter Policy
     * @example
     * <host-filter action="allow" failed-check-httpcode="401" failed-check-error-message="Not authorized">
     *     <host>13.66.201.169</host>
     *     <host>13.66.201.168</host>
     * </host-filter>
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        let authorised = policyElement.attributes.action !== 'allow';
        const header = get(context,`request.requestContext.headers.x-forwarded-host`);
        if(header && policyElement.elements) {
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
    public validate(context: Context) {
        return true;
    }
}