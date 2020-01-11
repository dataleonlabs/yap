import { get, set } from 'lodash';
import { js2xml } from 'xml-js';
import Policy, { ExecutionContext, PolicyCategory, Scope, YapPolicy } from '../policy';

/**
 * Json to xml policy
 * The json-to-xml policy converts a request or response body from JSON to XML.
 * @example
 * <json-to-xml apply="always | content-type-json" consider-accept-header="true | false" parse-date="true | false"/>
 */
@YapPolicy({
  id: 'json-to-xml',
  name: 'Json to xml policy',
  category: PolicyCategory.transformation,
  description: "The json-to-xml policy converts a request or response body from JSON to XML.",
  scopes: [Scope.inbound, Scope.outbound, Scope.onerror],
})
export default class JSONtoXML extends Policy {

  /**
   * Applies json to xml policy
   * @param executionContext execution context
   */
  public async apply(executionContext: ExecutionContext) {
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

  /**
   * Validates json to xml policy
   * @param policyElement policy element
   */
  public validate(policyElement: object) {
    const errors = [];
    const apply = get(policyElement, 'attributes.apply');
    if (['always', 'content-type-json'].indexOf(apply) === -1) {
        errors.push(`${this.id}-ERR-001: attribute 'apply' is required and should be one of 'always', 'content-type-json '`);
    }
    return errors;
  }
}