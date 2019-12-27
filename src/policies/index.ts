import { get, set } from 'lodash';
import vm from 'vm';
import { xml2js } from 'xml-js';
import CheckHTTPHeader from '../policies/access-restriction/check-http-header';
import { Context } from '../router';
import HostFilter from './access-restriction/host-filter';
import IpFilter from './access-restriction/ip-filter';
import ControlFlow from './advanced/control-flow';
import MockResponse from './advanced/mock-response';
import ReturnResponse from './advanced/return-response';
import SendRequest from './advanced/send-request';
import SetMethod from './advanced/set-method';
import SetStatus from './advanced/set-status';
import SetVariable from './advanced/set-variable';
import ApiKey from './authentification/api-key';
import AuthenticationBasic from './authentification/authentication-basic';
import CORS from './cors/cors';
import FindAndReplace from './transformation/find-and-replace';
import JSONtoXML from './transformation/json-to-xml';
import RewritePath from './transformation/rewrite-path';
import SetBody from './transformation/set-body';
import SetHeader from './transformation/set-header';
import SetQueryParameter from './transformation/set-query-parameter';
import XMLtoJSON from './transformation/xml-to-json';

/**
 * Policy categories enum
 */
export enum PolicyCategory {
    'accessrestriction' = 'access-restriction',
    'advanced' = 'advanced',
    'authentification' = 'authentification',
    'cors' = 'cors',
    'transformation' =
    'transformation',
}

/**
 * Policy scope enum
 */
export enum Scope { inbound = "inbound", outbound = "outbound", onerror = "on-error" }

/**
 * Execution context interface
 */
export interface ExecutionContext {
    /**
     * Policy element, which contains policy data
     */
    policyElement: any;

    /**
     * Request context
     */
    context: Context;

    /**
     * Request scope
     */
    scope: Scope;
}

export const tryExecuteFieldValue = (field?: string, executionContext?: ExecutionContext) => {
    if (field && executionContext && field.startsWith && field.startsWith('@(') && field.endsWith && field.endsWith(')')) {
        const scriptString = field.substring(2, field.length - 1);
        const vmExecutionContext = vm.createContext(executionContext);
        const script = new vm.Script(scriptString);
        return script.runInContext(vmExecutionContext);
    }
    return field;
};

export interface IPolicy {

    /**
     * String identificator for policy. Used to match policy-name with policy body
     */
    readonly id: string;

    /**
     * Name of a policy
     */
    readonly name: string;

    /**
     * Category of a policy
     */
    readonly category: PolicyCategory;

    /**
     * Descritpion of a policy
     */
    readonly description: string;

    /**
     * Acceptable scopes for a policy.
     */
    readonly scopes: Scope[];

    /**
     * Indicates if policy is internal
     * Please, do not set it to true for custom policies
     */
    readonly isInternal: boolean;

    /**
     * Used to validate whether policyElement can be accepted by core
     * @param policyElement - policy element in a format of JS object
     */
    validate(policyElement: object): string[];

    /**
     * Applies policy to context
     * @param policyElement  - policy element in a format of JS object
     * @param context - execution context
     * @param scope - execution scope
     */
    apply(executionContext: ExecutionContext): Promise<ExecutionContext>;
}

/**
 * Policy manager
 */
export class PolicyManager {

    /**
     * Registered policy definitions
     */
    public policies: { [id: string]: IPolicy; } = {};

    /**
     * Adds policy definition to array of policies
     * @param policy policy definition
     */
    public addPolicy(policy: IPolicy) {
        this.policies[policy.id] = policy;
    }

    /**
     * Get policy by its id, or returns undefined
     * @param id policy id, example set-header
     */
    public getPolicy(id: string) {
        return this.policies[id];
    }

    /**
     * APplies policy
     * @param executionContext Execution context contains policy data, request context and request scope
     */
    public apply(executionContext: ExecutionContext) {
        if (!this.policies[executionContext.policyElement.name]) {
            throw new Error(`Policy with id ${executionContext.policyElement.name} not registered`);
        }
        return this.policies[executionContext.policyElement.name].apply(executionContext);
    }

    /**
     * Validates policy element
     * @param policyElement policy element to validate
     */
    public validate(policyElement: any) {
        if (!this.policies[policyElement.name]) {
            throw new Error(`Policy with id ${policyElement.name} not registered`);
        }
        return this.policies[policyElement.name].validate(policyElement);
    }
}

const policyManager = new PolicyManager();

policyManager.addPolicy(new CheckHTTPHeader());
policyManager.addPolicy(new HostFilter());
policyManager.addPolicy(new IpFilter());

policyManager.addPolicy(new ControlFlow());
policyManager.addPolicy(new MockResponse());
policyManager.addPolicy(new ReturnResponse());
policyManager.addPolicy(new SendRequest());
policyManager.addPolicy(new SetMethod());
policyManager.addPolicy(new SetStatus());
policyManager.addPolicy(new SetVariable());

policyManager.addPolicy(new ApiKey());
policyManager.addPolicy(new AuthenticationBasic());

policyManager.addPolicy(new CORS());
policyManager.addPolicy(new FindAndReplace());
policyManager.addPolicy(new JSONtoXML());
policyManager.addPolicy(new XMLtoJSON());
policyManager.addPolicy(new RewritePath());
policyManager.addPolicy(new SetBody());
policyManager.addPolicy(new SetHeader());
policyManager.addPolicy(new SetQueryParameter());

export default policyManager;