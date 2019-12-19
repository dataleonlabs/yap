import assert from 'assert';
import { get, set } from 'lodash';
import * as sinon from 'sinon';
import { xml2js } from 'xml-js';
import policyManager, { ExecutionContext } from '../../../src/policies';
import ControlFlow from '../../../src/policies/advanced/control-flow';
import { getTestContext } from '../../tools';

const policy = {
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
        const executionContext:ExecutionContext = { policyElement: policy, context: getTestContext(), scope: 'outbound' };
        executionContext.context.request.body = { firstWhen: true };
        const setStatusSpy = sinon.spy(policyManager.getPolicy('set-status'), 'apply');
        const setMethodSpy = sinon.spy(policyManager.getPolicy('set-method'), 'apply');
        const setVariableSpy = sinon.spy(policyManager.getPolicy('set-variable'), 'apply');
        const appliedExecutionContext = await controlFlow.apply(executionContext);
        assert.equal(appliedExecutionContext.context.response.statusCode, "401");
        assert.equal(appliedExecutionContext.context.request.httpMethod, "GET");
        assert.equal(get(appliedExecutionContext, 'context.fields.username'), undefined);
        assert(setStatusSpy.calledOnce);
        assert(setMethodSpy.notCalled);
        assert(setVariableSpy.notCalled);
        setStatusSpy.restore();
        setMethodSpy.restore();
        setVariableSpy.restore();
    });

    it('U-TEST-2 - Should execute several when condition', async () => {
        const controlFlow = new ControlFlow();
        const executionContext:ExecutionContext = { policyElement: policy, context: getTestContext(), scope: 'outbound' };
        executionContext.context.request.body = { firstWhen: true, secondWhen: true };
        const setStatusSpy = sinon.spy(policyManager.getPolicy('set-status'), 'apply');
        const setMethodSpy = sinon.spy(policyManager.getPolicy('set-method'), 'apply');
        const setVariableSpy = sinon.spy(policyManager.getPolicy('set-variable'), 'apply');
        const appliedExecutionContext = await controlFlow.apply(executionContext);
        assert.equal(appliedExecutionContext.context.response.statusCode, "401");
        assert.equal(appliedExecutionContext.context.request.httpMethod, "PUT");
        assert.equal(get(appliedExecutionContext, 'context.fields.username'), undefined);
        assert(setStatusSpy.calledOnce);
        assert(setMethodSpy.calledOnce);
        assert(setVariableSpy.notCalled);
        setStatusSpy.restore();
        setMethodSpy.restore();
        setVariableSpy.restore();
    });

    it('U-TEST-3 - Should execute otherwise condition', async () => {
        const controlFlow = new ControlFlow();
        const executionContext:ExecutionContext = { policyElement: policy, context: getTestContext(), scope: 'outbound' };
        executionContext.context.request.body = { firstWhen: false, secondWhen: false };
        const setStatusSpy = sinon.spy(policyManager.getPolicy('set-status'), 'apply');
        const setMethodSpy = sinon.spy(policyManager.getPolicy('set-method'), 'apply');
        const setVariableSpy = sinon.spy(policyManager.getPolicy('set-variable'), 'apply');
        const appliedExecutionContext = await controlFlow.apply(executionContext);
        assert.equal(appliedExecutionContext.context.response.statusCode, "200");
        assert.equal(appliedExecutionContext.context.request.httpMethod, "GET");
        assert.equal(get(appliedExecutionContext, 'context.fields.username'), "Jhon");
        assert(setStatusSpy.notCalled);
        assert(setMethodSpy.notCalled);
        assert(setVariableSpy.calledOnce);
        setStatusSpy.restore();
        setMethodSpy.restore();
        setVariableSpy.restore();
    });

    it('U-TEST-4 - Should execute nothing', async () => {
        const controlFlow = new ControlFlow();
        const policyWithoutOtherwise = { ...policy};
        policyWithoutOtherwise.elements.splice(2, 1);
        const executionContext:ExecutionContext = { policyElement: policyWithoutOtherwise, context: getTestContext(), scope: 'outbound' };
        const setStatusSpy = sinon.spy(policyManager.getPolicy('set-status'), 'apply');
        const setMethodSpy = sinon.spy(policyManager.getPolicy('set-method'), 'apply');
        const setVariableSpy = sinon.spy(policyManager.getPolicy('set-variable'), 'apply');
        const appliedExecutionContext = await controlFlow.apply(executionContext);
        assert.equal(appliedExecutionContext.context.response.statusCode, "200");
        assert.equal(appliedExecutionContext.context.request.httpMethod, "GET");
        assert.equal(get(appliedExecutionContext, 'context.fields.username'), undefined);
        assert(setStatusSpy.notCalled);
        assert(setMethodSpy.notCalled);
        assert(setVariableSpy.notCalled);
        setStatusSpy.restore();
        setMethodSpy.restore();
        setVariableSpy.restore();
    });
});