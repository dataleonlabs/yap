import { get, set } from 'lodash';
import { js2xml } from 'xml-js';
import { Context } from "../../router";
import { IPolicy } from '../index';

export default class JSONtoXML implements IPolicy {

  public get id() {
    return 'json-to-xml';
  }

  /**
   * set-varable policy
   * The json-to-xml policy converts a request or response body from JSON to XML.
   * @example
   * <json-to-xml apply="always | content-type-json" consider-accept-header="true | false" parse-date="true | false"/>
   */
  public async apply(executionContext
    : { policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error' }) {
    const { policyElement, context, scope } = executionContext;

    const doConvert =
      (policyElement.attributes.apply === 'always' ||
        (policyElement.attributes.apply === 'content-type-json'
        && get(context, 'response.headers.Content-Type') === 'application/json'))
      ||
      ((policyElement.attributes['consider-accept-header'] !== 'false'
        && get(context, `request.requestContext.headers.Accept`) === 'application/json') ||
        (!policyElement.attributes.apply && !policyElement.attributes['consider-accept-header']));

    const dataToConvert = scope === 'inbound' ? context.request.body : context.response.body;
    if (doConvert && dataToConvert && typeof dataToConvert === 'object') {
      const res = js2xml(dataToConvert, { compact: true, ignoreComment: true, spaces: 4 });
      if (scope === 'inbound') {
        set(context, 'request.requestContext.headers.Accept', 'application/xml');
        context.request.body = res;
      } else {
        set(context, 'response.headers.Content-Type', 'application/xml');
        context.response.body = res;
      }
    }

    return executionContext;
  }

  public validate(policyElement: any) {
    return true;
  }
}