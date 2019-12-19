import { set } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy } from "../index";

export default class MockResponse implements IPolicy {

    public get id() {
        return 'mock-response';
    }

    /**
     * <mock-response> policy
     * The mock-response, as the name implies, is used to mock APIs and operations.
     * It aborts normal pipeline execution and returns a mocked response to the caller.
     * @example
     *
     *  Returns 200 OK status code. Content is based on parameter body (optional)
     *  <mock-response status-code='200' content-type='application/json' body='someBody'/>
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        context.response.body = policyElement.attributes.body || context.response.body;
        context.response.statusCode = policyElement.attributes['status-code'] || context.response.statusCode;
        if (policyElement.attributes['content-type']) {
            set(context, 'response.headers.content-type', policyElement.attributes['content-type']);
        }
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}