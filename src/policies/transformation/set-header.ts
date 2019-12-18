import { Context } from "../../Router";

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
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    if(policyElement.name=="set-header"){
        policyElement.elements.forEach((element:any) => {
            let header: any = {};
            const headerKey: any = (policyElement.attributes.name as { [key: string]: any });
            header[headerKey] = element.elements[0].text;
            if(policyElement.attributes['exists-action']=="override"){
                context.response.headers = header;
            } else if(policyElement.attributes['exists-action']=="append"){
                context.response.headers = { ...context.response.headers, ...header };
            } else if(policyElement.attributes['exists-action']=="delete") {
                delete context.response.headers;
            } else {
            }
        })
    }
    return { policyElement, context, scope };
};