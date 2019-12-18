import { Context } from "../../../src/router";
import { js2xml } from 'xml-js';
import { set } from 'lodash';

/**
 * set-varable policy
 * The json-to-xml policy converts a request or response body from JSON to XML.
 * @example
 * <json-to-xml apply="always | content-type-json" consider-accept-header="true | false" parse-date="true | false"/>
 */
export default async(policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
      const res = js2xml({
              "testSuites": [
                {
                  "name": "TS_EdgeHome",
                  "testCases": [
                    {
                      "name": "tc_Login",
                      "data": "dt_EdgeCaseHome,dt_EdgeCaseRoute"
                    },
                    {
                      "name": "tc_Logout",
                      "data": "dt_EdgeCaseRoute"
                    }
                  ]
                }
              ]
            });
      
      set(context, 'response.headers.Content-type', 'application/xml');
      context.response.body = res;

    return { policyElement, context, scope };
};