import { get, set } from 'lodash';
import { ExecutionContext } from '..';
import { Context } from "../../router";

export default class FindAndReplace {

    public get id() {
        return 'find-and-replace';
    }

    /**
     * set-varable policy
     * The find-and-replace policy copies value from one path to another,
     * in request or response objects
     * from and ot attributes showed path in a dot notation
     * @example
     * <find-and-replace from="field.subfield1" to="field.subfield2" />
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const containerObject = scope === 'inbound' ? context.request.body : context.response.body;
        const fromValue = get(containerObject, policyElement.attributes.from);
        set(containerObject, policyElement.attributes.to, fromValue);
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}