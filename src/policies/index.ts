import vm from 'vm';
import CheckHTTPHeader from './accessRestriction/CheckHttpHeader';
import HostFilter from './accessRestriction/HostFilter';
import IpFilter from './accessRestriction/IpFilter';
import CloudWatchLogs from './advanced/CloudwatchLogs';
import ControlFlow from './advanced/ControlFlow';
import MockResponse from './advanced/MockResponse';
import ReturnResponse from './advanced/ReturnResponse';
import SendRequest from './advanced/SendRequest';
import Sentry from './advanced/Sentry';
import SetMethod from './advanced/SetMethod';
import SetStatus from './advanced/SetStatus';
import SetVariable from './advanced/SetVariable';
import ApiKey from './authentification/ApiKey';
import AuthenticationBasic from './authentification/AuthenticationBasic';
import CORS from './cors/CORS';
import Policy, { ExecutionContext, PolicyCategory, Scope } from "./policy";
import FindAndReplace from './transformation/FindAndReplace';
import JSONtoXML from './transformation/JSONToXML';
import RewritePath from './transformation/RewritePath';
import SetBody from './transformation/SetBody';
import SetHeader from './transformation/SetHeader';
import SetQueryParameter from './transformation/SetQueryParameter';
import XMLtoJSON from './transformation/XMLToJSON';

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
 * Replaces all execution placeholder in string with execution result
 * @param field string, contains @(...) execution placehoders
 * @param executionContext execution context
 */
export const executeInString = (field: string, executionContext?: any) => {
    if (field && executionContext && typeof field === "string" && field.indexOf('@(') > -1) {
        const entries =
            field.split('@(')
                .map((entry) => entry.substring(0, entry.lastIndexOf(')')));
        for (const entry of entries) {
            if (entry) {
                const vmExecutionContext = vm.createContext(executionContext);
                const script = new vm.Script(entry);
                const newValue = script.runInContext(vmExecutionContext);
                field = field.replace(`@(${entry})`, newValue);
            }
        }
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
        if (!policy.id) {
            throw new Error("Policy should have non-empty id value");
        }
        if (!policy.name) {
            throw new Error("Policy should have non-empty name value");
        }
        if (policy.category === PolicyCategory.undefined) {
            throw new Error("Policy should have policy category which not have undefined");
        }
        if (!policy.scopes.length) {
            throw new Error("Policy should have at least one scope");
        }
        this.policies[policy.id] = policy;
    }

    /**
     * Deletes policy definition
     * @param id id of policy which should be deleted
     */
    public deletePolicy(id: string) {
        delete this.policies[id];
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

policyManager.addPolicy(new CloudWatchLogs());
policyManager.addPolicy(new ControlFlow());
policyManager.addPolicy(new MockResponse());
policyManager.addPolicy(new ReturnResponse());
policyManager.addPolicy(new Sentry());
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
    'cloudwatch-logs',
    'control-flow',
    'mock-response',
    'return-response',
    'send-request',
    'sentry',
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