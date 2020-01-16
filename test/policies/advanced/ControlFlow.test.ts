import assert from 'assert';
import { cloneDeep, get, set } from 'lodash';
import * as sinon from 'sinon';
import policyManager from '../../../src/policies';
import ControlFlow from '../../../src/policies/advanced/ControlFlow';
import { getTestContext } from '../../tools';
import { ExecutionContext, Scope } from '../../../src';

const policy: any = {
    type: "element",
    name: "choose",
    elements:
        [{
            type: "element",
            name: "when",
            attributes: {
                condition: "@(context.request.body.firstWhen === true)",
            },
            elements: [{
                type: "element",
                name: "set-status",
                attributes: {
                    code: "401", reason: "Unauthorized",
                },
            }],
        },
        {
            type: "element",
            name: "when", attributes:
                { condition: "@(context.request.body.secondWhen === true)" },
            elements: [
                {
                    type: "element", name: "set-method", elements: [
                        { type: "text", text: "PUT" }],
                }],
        },
        {
            type: "element", name: "otherwise", elements:
                [{
                    type: "element", name: "set-variable",
                    attributes: { name: "username", value: "Jhon" },
                }],
        }],
};

describe("<control-flow />", () => {
    it('U-TEST-1 - Should execute one when condition', async () => {
        const controlFlow = new ControlFlow();
        const executionContext: ExecutionContext = { policyElement: policy, context: getTestContext(), scope: Scope.outbound };
        executionContext.context.request.body = { firstWhen: true };
        const setStatusSpy = sinon.spy(policyManager.getPolicy('set-status'), 'apply');
        const setMethodSpy = sinon.spy(policyManager.getPolicy('set-method'), 'apply');
        const setVariableSpy = sinon.spy(policyManager.getPolicy('set-variable'), 'apply');
        const appliedExecutionContext = await controlFlow.apply(executionContext);
        assert.equal(appliedExecutionContext.context.response.statusCode, "401");
        assert.equal(appliedExecutionContext.context.request.httpMethod, "GET");
        assert.equal(get(appliedExecutionContext, 'context.variables.username'), undefined);
        assert(setStatusSpy.calledOnce);
        assert(setMethodSpy.notCalled);
        assert(setVariableSpy.notCalled);
        setStatusSpy.restore();
        setMethodSpy.restore();
        setVariableSpy.restore();
    });

    it('U-TEST-2 - Should execute several when condition', async () => {
        const controlFlow = new ControlFlow();
        const executionContext: ExecutionContext = { policyElement: policy, context: getTestContext(), scope: Scope.outbound };
        executionContext.context.request.body = { firstWhen: true, secondWhen: true };
        const setStatusSpy = sinon.spy(policyManager.getPolicy('set-status'), 'apply');
        const setMethodSpy = sinon.spy(policyManager.getPolicy('set-method'), 'apply');
        const setVariableSpy = sinon.spy(policyManager.getPolicy('set-variable'), 'apply');
        const appliedExecutionContext = await controlFlow.apply(executionContext);
        assert.equal(appliedExecutionContext.context.response.statusCode, "401");
        assert.equal(appliedExecutionContext.context.request.httpMethod, "PUT");
        assert.equal(get(appliedExecutionContext, 'context.variables.username'), undefined);
        assert(setStatusSpy.calledOnce);
        assert(setMethodSpy.calledOnce);
        assert(setVariableSpy.notCalled);
        setStatusSpy.restore();
        setMethodSpy.restore();
        setVariableSpy.restore();
    });

    it('U-TEST-3 - Should execute otherwise condition', async () => {
        const controlFlow = new ControlFlow();
        const executionContext: ExecutionContext = { policyElement: policy, context: getTestContext(), scope: Scope.outbound };
        executionContext.context.request.body = { firstWhen: false, secondWhen: false };
        const setStatusSpy = sinon.spy(policyManager.getPolicy('set-status'), 'apply');
        const setMethodSpy = sinon.spy(policyManager.getPolicy('set-method'), 'apply');
        const setVariableSpy = sinon.spy(policyManager.getPolicy('set-variable'), 'apply');
        const appliedExecutionContext = await controlFlow.apply(executionContext);
        assert.equal(appliedExecutionContext.context.response.statusCode, "200");
        assert.equal(appliedExecutionContext.context.request.httpMethod, "GET");
        assert.equal(get(appliedExecutionContext, 'context.variables.username'), "Jhon");
        assert(setStatusSpy.notCalled);
        assert(setMethodSpy.notCalled);
        assert(setVariableSpy.calledOnce);
        setStatusSpy.restore();
        setMethodSpy.restore();
        setVariableSpy.restore();
    });

    it('U-TEST-4 - Should execute nothing', async () => {
        const controlFlow = new ControlFlow();
        const policyWithoutOtherwise = cloneDeep(policy);
        policyWithoutOtherwise.elements.splice(2, 1);
        const executionContext: ExecutionContext = { policyElement: policyWithoutOtherwise, context: getTestContext(), scope: Scope.outbound };
        const setStatusSpy = sinon.spy(policyManager.getPolicy('set-status'), 'apply');
        const setMethodSpy = sinon.spy(policyManager.getPolicy('set-method'), 'apply');
        const setVariableSpy = sinon.spy(policyManager.getPolicy('set-variable'), 'apply');
        const appliedExecutionContext = await controlFlow.apply(executionContext);
        assert.equal(appliedExecutionContext.context.response.statusCode, "200");
        assert.equal(appliedExecutionContext.context.request.httpMethod, "GET");
        assert.equal(get(appliedExecutionContext, 'context.variables.username'), undefined);
        assert(setStatusSpy.notCalled);
        assert(setMethodSpy.notCalled);
        assert(setVariableSpy.notCalled);
        setStatusSpy.restore();
        setMethodSpy.restore();
        setVariableSpy.restore();
    });

    it('U-TEST-5 - Should validate control flow', async () => {
        const controlFlow = new ControlFlow();
        const validationResult = controlFlow.validate(policy);
        assert.deepEqual(validationResult, []);
    });

    it('U-TEST-5 - Should validate control flow', async () => {
        const controlFlow = new ControlFlow();
        const invalidPolicy = cloneDeep(policy);
        invalidPolicy.elements.push({
            name: "then",
        });
        invalidPolicy.elements.push({
            type: "element",
            name: "when",
            attributes: {

            },
            elements: [{
                type: "element",
                name: "set-statusy",
                attributes: {
                    code: "401", reason: "Unauthorized",
                },
            }],
        });
        invalidPolicy.elements.push({
            type: "element",
            name: "when",
            attributes: {

            },
            elements: [],
        });
        const validationResult = controlFlow.validate(invalidPolicy);
        assert.deepEqual(validationResult, [
            "control-flow-ERR-002: Element <then> is forbiden. Should be <when> or <otherwise> only",
            "control-flow-ERR-003: <when> should have condition attribute",
            "policies-ERR-005: XML tag <when> contains unknown policy <set-statusy>. Please, load definition for this policy before loading of XML",
            "control-flow-ERR-003: <when> should have condition attribute",
            "control-flow-ERR-004: <when>, <otherwise> should have children elements of policy types",
        ]);
    });
});