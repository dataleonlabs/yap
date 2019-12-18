import { Context } from "../../../src/Router";

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
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    if(policyElement.name=="return-response"){
        policyElement.elements.forEach((element:any) => {
            if(element.name=="set-header"){
                let header: any = {};
                const headerKey: any = (element.attributes.name as { [key: string]: any });
                header[headerKey] = element.elements[0].elements[0].text;
                context.response.headers = header;
            }
            if(element.name=="set-status"){
                context.response.statusCode = element.attributes.code;
            }
        })
    }
    return { policyElement, context, scope };
};