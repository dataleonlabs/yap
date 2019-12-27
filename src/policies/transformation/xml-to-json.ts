import { get, set } from 'lodash';
import { xml2js } from 'xml-js';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, PolicyCategory, Scope } from '../index';

/**
 * Xml to json policy
 * The xml-to-json policy converts a request or response body from XML to JSON.
 * @example
 * <xml-to-json kind="javascript-friendly | direct" apply="always | content-type-xml" consider-accept-header="true | false"/>
 */
export default class XMLtoJSON implements IPolicy {

  /**
   * Policy id
   */
  public get id() {
    return 'xml-to-json';
  }

  /**
   * Policy name
   */
  public get name() {
    return 'Xml to json policy';
  }

  /**
   * Policy category
   */
  public get category() {
    return PolicyCategory.transformation;
  }

  /**
   * Policy description
   */
  public get description() {
    return "The xml-to-json policy converts a request or response body from XML to JSON.";
  }

  /**
   * Policy available scopes
   */
  public get scopes() {
    return [Scope.inbound, Scope.outbound, Scope.onerror];
  }

  /**
   * If policy is YAP internal policy
   */
  public get isInternal() {
    return true;
  }

  /**
   * Applies xml to json policy
   * @param executionContext execution context
   */
  public async apply(executionContext: ExecutionContext) {
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

  /**
   * Validates xml to json policy
   * @param policyElement policy element
   */
  public validate(policyElement: object) {
    const errors = [];
    const apply = get(policyElement, 'attributes.apply');
    const kind = get(policyElement, 'attributes.kind');
    if (['always', 'content-type-xml'].indexOf(apply) === -1) {
      errors.push(`${this.id}-ERR-001: attribute 'apply' is required and should be one of 'always', 'content-type-xml'`);
    }
    if (['direct', 'javascript-friendly'].indexOf(kind) === -1) {
      errors.push(`${this.id}-ERR-002: attribute 'kind' is required and should be one of 'direct', 'javascript-friendly'`);
    }
    return errors;
  }
}