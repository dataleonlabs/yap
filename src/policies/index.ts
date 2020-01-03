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
import Policy, { ExecutionContext, PolicyCategory, Scope} from "./policy";
import FindAndReplace from './transformation/find-and-replace';
import JSONtoXML from './transformation/json-to-xml';
import RewritePath from './transformation/rewrite-path';
import SetBody from './transformation/set-body';
import SetHeader from './transformation/set-header';
import SetQueryParameter from './transformation/set-query-parameter';
import XMLtoJSON from './transformation/xml-to-json';

/**
 * Tries to execute script in a given context, or just return script as string variable
 * @param field Script in a format of @(....some js code....) or a variable
 * @param executionContext Execution context to be used in VM execution process
 */
export const tryExecuteFieldValue = (field?: string, executionContext?: ExecutionContext) => {
    if (field && executionContext && field.startsWith && field.startsWith('@(') && field.endsWith && field.endsWith(')')) {
        const scriptString = field.substring(2, field.length - 1);
        const vmExecutionContext = vm.createContext(executionContext);
        const script = new vm.Script(scriptString);
        return script.runInContext(vmExecutionContext);
    }
    return field;
};

/**
 * Policy manager
 */
export class PolicyManager {

    /**
     * Registered policy definitions
     */
    public policies: { [id: string]: Policy; } = {};

    /**
     * Adds policy definition to array of policies
     * @param policy policy definition
     */
    public addPolicy(policy: Policy) {
        if(!policy.id) {
            throw new Error("Policy should have non-empty id value");
        }
        if(!policy.name) {
            throw new Error("Policy should have non-empty name value");
        }
        if(policy.category === PolicyCategory.undefined) {
            throw new Error("Policy should have policy category which not have undefined");
        }
        if(!policy.scopes.length) {
            throw new Error("Policy should have at least one scope");
        }
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
     * Applies policy
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

export const internalPolicies = [
    'check-header',
    'host-filter',
    'ip-filter',
    'control-flow',
    'mock-response',
    'return-response',
    'send-request',
    'set-method',
    'set-status',
    'set-variable',
    'api-key',
    'authentication-basic',
    'cors',
    'find-and-replace',
    'json-to-xml',
    'rewrite-path',
    'set-body',
    'set-header',
    'set-query-parameter',
    'xml-to-json',
];

export default policyManager;