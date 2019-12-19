import { get, set, take, unset } from 'lodash';
import { isArray } from "util";
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from "../index";
const separateHeadersNames =
    ["User-Agen", "WWW-Authenticate", "Proxy-Authenticate",
        "Cookie", "Set-Cookie", "Warning",
        "Date", "Expires", "If-Modified-Since",
        "If-Unmodified-Since", "Last-Modified", "Retry-After"];

export default class SetHeader implements IPolicy {

    public get id() {
        return 'set-header';
    }

    /**
     * set-header policy
     * The set-header policy assigns a value to an existing response and/or request
     * header or adds a new response and/or request header.
     * Inserts a list of HTTP headers into an HTTP message.
     * When placed in an inbound pipeline, this policy sets the HTTP headers
     * for the request being passed to the target service. When placed in an outbound pipeline,
     * this policy sets the HTTP headers for the response being sent to the gateway’s client.
     * @example
     * <set-header name="WWW-Authenticate" exists-action="override">
     *   <value>Bearer error="invalid_token"</value>
     * </set-header>
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const headerCollectionPath = scope === 'inbound' ? 'request.headers' : 'response.headers';
        const existingAction = policyElement.attributes['exists-action'];
        const isHeaderInSeparateName = separateHeadersNames.indexOf(policyElement.attributes.name) > 0;

        const headerName = policyElement.attributes.name;
        const values = policyElement.elements.map((e: { elements: Array<{ text: any; }>; }) =>
            tryExecuteFieldValue(get(e, 'elements[0].text')), executionContext);
        const headerValue = isHeaderInSeparateName ? values : values.join(',');
        const currentValue = get(context, `${headerCollectionPath}[${headerName}]`);

        //common cases
        switch (existingAction) {
            case 'append':
                if (currentValue) {
                    if (isHeaderInSeparateName) {
                        headerValue.append(currentValue);
                    } else {
                        headerValue[0] = `${headerValue[0]},${currentValue}`;
                    }
                }
                set(context, `${headerCollectionPath}[${headerName}]`, headerValue);
                break;
            case 'skip':
                if (!currentValue) {
                    set(context, `${headerCollectionPath}[${headerName}]`, headerValue);
                }
                break;
            case 'override':
                set(context, `${headerCollectionPath}[${headerName}]`, headerValue);
                break;
            case 'delete':
                unset(context, `${headerCollectionPath}[${headerName}]`);
                break;
        }
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}