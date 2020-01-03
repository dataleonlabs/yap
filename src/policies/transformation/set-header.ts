import { get, set, take, unset } from 'lodash';
import { isArray } from "util";
import { Context } from "../../router";
import { tryExecuteFieldValue } from "../index";
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';
const separateHeadersNames =
    ["User-Agen", "WWW-Authenticate", "Proxy-Authenticate",
        "Cookie", "Set-Cookie", "Warning",
        "Date", "Expires", "If-Modified-Since",
        "If-Unmodified-Since", "Last-Modified", "Retry-After"];

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
@YapPolicy({
    id: 'set-header',
    name: 'Set header policy',
    category: PolicyCategory.transformation,
    description: "The set-header policy assigns a value to an existing response and/or request",
    scopes: [Scope.inbound, Scope.outbound, Scope.onerror],
  })
export default class SetHeader extends Policy {

    /**
     * Applies set header policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const responseVariableName = get(policyElement, 'attributes.response-variable-name');
        const headerCollectionPath = responseVariableName
        ? `fields.${responseVariableName}`
        : scope === 'inbound'
            ? 'request.headers'
            : 'response.headers';
        const existingAction = policyElement.attributes['exists-action'];
        const isHeaderInSeparateName = separateHeadersNames.indexOf(policyElement.attributes.name) > 0;

        const headerName = policyElement.attributes.name;
        // tslint:disable-next-line: completed-docs
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

    /**
     * Validates set header policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        const name = get(policyElement, 'attributes.name');
        if (!name) {
            errors.push(`${this.id}-ERR-001: Name attribute should be set. For example name="WWW-Authenticate"`);
        }
        if(!policyElement.elements || !policyElement.elements.length) {
            errors.push(`${this.id}-ERR-002: At least one of value of headers should be set. Example <value>Bearer error="invalid_token"</value>`);
        }
        return errors;
    }
}