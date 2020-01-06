import assert from 'assert';
import * as sinon from 'sinon';
import policyManager, { PolicyManager, tryExecuteFieldValue } from '../src/policies';
import { ExecutionContext, PolicyCategory, Scope } from '../src/policies/policy';
import { Context } from '../src/router';
import { getTestContext } from './tools';

describe("Policy manager", async () => {

    const testContext = {
        request: { httpMethod: 'POST' },
        response: {}, variables: {}, connection: {},
    };

    it("U-TEST-1 Should add policy", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            name: "superPolicy",
            description: "superPolicy",
            scopes: [Scope.inbound],
            category: PolicyCategory.cors,
            isInternal: true,
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => [],
        };
        policyManager.addPolicy(policy);
        assert(true, "Policy added");
    });

    it("U-TEST-2 Should return policy", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            name: "superPolicy",
            description: "superPolicy",
            scopes: [Scope.inbound],
            category: PolicyCategory.cors,
            isInternal: true,
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => [],
        };
        policyManager.addPolicy(policy);
        assert.equal(policyManager.getPolicy(policy.id).id, policy.id);
    });

    it("U-TEST-3 Should apply policy", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            name: "superPolicy",
            description: "superPolicy",
            scopes: [Scope.inbound],
            category: PolicyCategory.cors,
            isInternal: true,
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => [],
        };
        policyManager.addPolicy(policy);
        const spy = sinon.spy(policy, 'apply');
        policyManager.apply({ policyElement: { name: policy.id }, context: testContext, scope:Scope.inbound});
        assert.equal(spy.called, 1);
    });

    it("U-TEST-4 Should validate policy", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            name: "superPolicy",
            description: "superPolicy",
            scopes: [Scope.inbound],
            category: PolicyCategory.cors,
            isInternal: true,
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => [],
        };
        policyManager.addPolicy(policy);
        const spy = sinon.spy(policy, 'validate');
        policyManager.validate({ name: policy.id });
        assert.equal(spy.called, 1);
    });

    it("U-TEST-5 Should throw if no policy in manager", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            name: "superPolicy",
            description: "superPolicy",
            scopes: [Scope.inbound],
            category: PolicyCategory.cors,
            isInternal: true,
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => [],
        };
        policyManager.addPolicy(policy);
        assert.throws(() => policyManager.validate({ name: 'nonexistent' }), Error, `Policy with id nonexistent not registered`);
        assert.throws(() => policyManager.apply({ policyElement: { name: 'nonexistent' }, context: testContext, scope:Scope.inbound}), Error, `Policy with id nonexistent not registered`);
    });

    it("U-TEST-6 Singleton should have required policy list", async () => {
        const requiredPolicies = [
            'check-header',
            'host-filter',
            'ip-filter',
            'cloudwatch-logs',
            'control-flow',
            'mock-response',
            'return-response',
            'sentry',
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
        const policiesRegistered = Object.keys(policyManager.policies);
        assert.deepEqual(policiesRegistered.sort(), requiredPolicies.sort());
    });

    it("U-TEST-7 Evaluate script in policy value", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            name: "superPolicy",
            description: "superPolicy",
            scopes: [Scope.inbound],
            category: PolicyCategory.cors,
            isInternal: true,
            apply: async (executionContext:ExecutionContext) => {
                // tslint:disable-next-line: no-invalid-template-strings
                const value = tryExecuteFieldValue('@(`${scope}_${context.request.httpMethod}_${policyElement.attributes.wey}`)', executionContext);
                executionContext.context.response.body = value;
                return executionContext;
            },
            validate: (policyElement: any) => [],
        };
        policyManager.addPolicy(policy);
        const policyElement = {
            name: "superPolicy",
            attributes: {
                wey: 'existingAttribute',
            },
        };
        const { context } = await policyManager.apply({policyElement, context: testContext, scope:Scope.inbound});
        assert.equal(context.response.body, 'inbound_POST_existingAttribute');
    });
});