import { get, set } from 'lodash';
import { xml2js } from 'xml-js';
import { Context } from "../../router";
import { IPolicy } from '../index';

export default class XMLtoJSON implements IPolicy {

  public get id() {
    return 'xml-to-json';
  }

  /**
   * set-varable policy
   * The xml-to-json policy converts a request or response body from XML to JSON.
   * @example
   * <xml-to-json kind="javascript-friendly | direct" apply="always | content-type-xml" consider-accept-header="true | false"/>
   */
  public async apply(executionContext
    : { policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error' }) {
    const { policyElement, context, scope } = executionContext;
    const doConvert =
      (policyElement.attributes.apply === "always" ||
        (policyElement.attributes.apply === "content-type-xml"
          && get(context, 'response.headers.Content-Type') === 'application/xml'))
      ||
      ((policyElement.attributes['consider-accept-header'] === 'false') ||
        (policyElement.attributes['consider-accept-header'] !== 'false'
          && get(context, `request.requestContext.headers.Accept`) === 'application/xml'));
    const dataToConvert = scope === 'inbound' ? context.request.body : context.response.body;
    if (doConvert && dataToConvert && typeof dataToConvert === 'string') {
      const res = xml2js(dataToConvert, { compact: policyElement.attributes.kind === 'javascript-friendly', ignoreComment: true });
      if (scope === 'inbound') {
        set(context, 'request.requestContext.headers.Accept', 'application/json');
        context.request.body = res;
      } else {
        set(context, 'response.headers.Content-Type', 'application/json');
        context.response.body = res;
      }
    }
    return executionContext;
  }

  public validate(policyElement: any) {
    return true;
  }
}