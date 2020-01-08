import { get } from 'lodash';
import { tryExecuteFieldValue } from "../index";
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

/**
 * CORS Policy
 * The CORS policy adds cross-origin resource sharing (CORS) support
 * to an operation or an API to allow cross-domain calls from browser-based clients.
 * CORS allows a browser and a server to interact and determine whether
 * or not to allow specific cross-origin requests
 * (i.e. XMLHttpRequests calls made from JavaScript on a web page to other domains).
 * This allows for more flexibility than only allowing same-origin requests,
 * but is more secure than allowing all cross-origin requests.
 * @example
 * <cors allow-credentials="false|true">
 *   <allowed-origins>
 *       <origin>origin uri</origin>
 *   </allowed-origins>
 *   <allowed-methods preflight-result-max-age="number of seconds">
 *       <method>http verb</method>
 *   </allowed-methods>
 *   <allowed-headers>
 *       <header>header name</header>
 *   </allowed-headers>
 *   <expose-headers>
 *       <header>header name</header>
 *   </expose-headers>
 * </cors>
 *
 * <cors allow-credentials="true">
 *   <allowed-origins>
 *       <!-- Localhost useful for development -->
 *       <origin>http://localhost:8080/</origin>
 *       <origin>http://example.com/</origin>
 *   </allowed-origins>
 *   <allowed-methods preflight-result-max-age="300">
 *       <method>GET</method>
 *       <method>POST</method>
 *       <method>PATCH</method>
 *       <method>DELETE</method>
 *   </allowed-methods>
 *   <allowed-headers>
 *       <!-- Examples below show Azure Mobile Services headers -->
 *       <header>x-zumo-installation-id</header>
 *       <header>x-zumo-application</header>
 *       <header>x-zumo-version</header>
 *       <header>x-zumo-auth</header>
 *       <header>content-type</header>
 *       <header>accept</header>
 *   </allowed-headers>
 *   <expose-headers>
 *       <!-- Examples below show Azure Mobile Services headers -->
 *       <header>x-zumo-installation-id</header>
 *       <header>x-zumo-application</header>
 *   </expose-headers>
 * </cors>
 */
@YapPolicy({
    id: 'cors',
    name: 'CORS Policy',
    category: PolicyCategory.cors,
    description: "The CORS policy adds cross-origin resource sharing (CORS) support",
    scopes: [Scope.inbound],
  })
export default class CORS extends Policy {

    /**
     * Applies cors policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        let header: any = {};
        const origin: any = [];
        const method: any = [];
        const allowedHeader: any = [];
        const exposedHeader: any = [];
        header = policyElement.attributes;
        context.response.headers = { ...context.response.headers, ...header };
        policyElement.elements.map((corsKey: any) => {
            corsKey.elements.map((elementKey: any) => {
                const elementValue = tryExecuteFieldValue(get(elementKey, 'elements[0].text'), executionContext);
                if (elementKey.name === "origin") {
                    origin.push(elementValue);
                    header[corsKey.name] = origin.join(",");
                } else if (elementKey.name === "method") {
                    method.push(elementValue);
                    header[corsKey.name] = method.join(",");
                } else if (elementKey.name === "header" && corsKey.name === "allowed-headers") {
                    allowedHeader.push(elementValue);
                    header[corsKey.name] = allowedHeader.join(",");
                } else if (elementKey.name === "header" && corsKey.name === "expose-headers") {
                    exposedHeader.push(elementValue);
                    header[corsKey.name] = exposedHeader.join(",");
                }
            });
            context.response.headers = { ...context.response.headers, ...header };
        });
        return executionContext;
    }

    /**
     * Validates cors policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        if (!policyElement.elements || !policyElement.elements.length) {
            errors.push(`${this.id}-ERR-001: should have at least one element, of `
            +`<allowed-origins>, <allowed-methods>, <allowed-headers> or <expose-headers>`);
        } else {
            let allowedOriginsSet = false;
            for (const element of policyElement.elements) {
                switch (element.name) {
                    case 'allowed-origins':
                        if(element.elements && element.elements.length) {
                            allowedOriginsSet = true;
                        }
                        break;
                    case 'allowed-methods':
                        if(!element.elements || !element.elements.length) {
                            errors.push(`${this.id}-ERR-003: Element <allowed-methods> should have at least one method allowed`);
                        }
                        break;
                    case 'allowed-headers':
                        if(!element.elements || !element.elements.length) {
                            errors.push(`${this.id}-ERR-004: Element <allowed-headers> should have at least one header allowed`);
                        }
                        break;
                    case 'expose-headers':
                        if(!element.elements || !element.elements.length) {
                            errors.push(`${this.id}-ERR-005: Element <expose-headers> should have at least one header exposed`);
                        }
                        break;
                    default:
                        errors.push(`${this.id}-ERR-002: Element <${element.name}> is forbiden. `
                        +`Should be <allowed-origins>, <allowed-methods>, <allowed-headers> or <expose-headers> only`);
                        break;
                }
            }
            if(!allowedOriginsSet) {
                errors.push(`${this.id}-ERR-002: tag <allowed-origins> should persist and have at least one element`);
            }
        }
        return errors;
    }
}