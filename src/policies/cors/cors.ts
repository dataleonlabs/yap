import { get } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from "../index";

export default class CORS implements IPolicy {

    public get id() {
        return 'cors';
    }

    /**
     * cors Policy
     * The cors policy adds cross-origin resource sharing (CORS) support
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
public async apply(executionContext:ExecutionContext) {
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

    public validate(policyElement: any) {
        return true;
    }
}