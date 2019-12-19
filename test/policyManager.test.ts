import assert from 'assert';
import * as sinon from 'sinon';
import policyManager, { ExecutionContext, PolicyManager, tryExecuteFieldValue } from '../src/policies';
import { Context } from '../src/router';

describe("Policy manager", async () => {

    const testContext = {
        request: { httpMethod: 'POST' },
        response: {}, fields: {}, connection: {},
    };

    it("U-TEST-1 Should add policy", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => true,
        };
        policyManager.addPolicy(policy);
        assert(true, "Policy added");
    });

    it("U-TEST-2 Should return policy", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => true,
        };
        policyManager.addPolicy(policy);
        assert.equal(policyManager.getPolicy(policy.id).id, policy.id);
    });

    it("U-TEST-3 Should apply policy", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => true,
        };
        policyManager.addPolicy(policy);
        const spy = sinon.spy(policy, 'apply');
        policyManager.apply({ policyElement: { name: policy.id }, context: testContext, scope: 'inbound'});
        assert.equal(spy.called, 1);
    });

    it("U-TEST-4 Should validate policy", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => true,
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
            apply: async (executionContext:ExecutionContext) => executionContext,
            validate: (policyElement: any) => true,
        };
        policyManager.addPolicy(policy);
        assert.throws(() => policyManager.validate({ name: 'nonexistent' }), Error, `Policy with id nonexistent not registered`);
        assert.throws(() => policyManager.apply({ policyElement: { name: 'nonexistent' }, context: testContext, scope: 'inbound'}), Error, `Policy with id nonexistent not registered`);
    });

    it("U-TEST-6 Singleton should have required policy list", async () => {
        const requiredPolicies = [
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
        const policiesRegistered = Object.keys(policyManager.policies);
        assert.deepEqual(policiesRegistered.sort(), requiredPolicies.sort());
    });

    it("U-TEST-7 Evaluate script in policy value", async () => {
        const policyManager = new PolicyManager();
        const policy = {
            id: "superPolicy",
            apply: async (executionContext:ExecutionContext) => {
                const value = tryExecuteFieldValue('@(`${scope}_${context.request.httpMethod}_${policyElement.attributes.wey}`)', executionContext);
                executionContext.context.response.body = value;
                return executionContext;
            },
            validate: (policyElement: any) => true,
        };
        policyManager.addPolicy(policy);
        const policyElement = {
            name: "superPolicy",
            attributes: {
                wey: 'existingAttribute',
            },
        };
        const { context } = await policyManager.apply({policyElement, context: testContext, scope: 'inbound'});
        assert.equal(context.response.body, 'inbound_POST_existingAttribute');
    });
});