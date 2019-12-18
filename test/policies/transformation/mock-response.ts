import { Context } from "../../../src/Router";

/**
 * <mock-response policy
 * The mock-response, as the name implies, is used to mock APIs and operations.
 * It aborts normal pipeline execution and returns a mocked response to the caller.
 * The policy always tries to return responses of highest fidelity.
 * It prefers response content examples, whenever available.
 * It generates sample responses from schemas, when schemas are
 * provided and examples are not. If neither examples or schemas are found,
 * responses with no content are returned.
 * @example
 * <mock-response status-code="code" content-type="media type"/>
 * <!-- Returns 200 OK status code. Content is based on an example or schema, if provided for this
 *   status code. First found content type is used. If no example or schema is found, the content is empty. -->
 *  <mock-response/>
 *
 *  <!-- Returns 200 OK status code. Content is based on an example or schema, if provided for this
 *  status code and media type. If no example or schema found, the content is empty. -->
 *  <mock-response status-code='200' content-type='application/json'/>
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    
    if(policyElement.name=="mock-response"){
        let header: any = {};
            Object.keys(policyElement.attributes).map(key=>{
                header[key] = policyElement.attributes[key];
                header[key] = policyElement.attributes[key];
            })
            context.response.headers = header;
    }
    return { policyElement, context, scope };
};