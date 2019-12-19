import { set } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, tryExecuteFieldValue } from '../index';

export default class SetVariable implements IPolicy {

    public get id() {
        return 'set-variable';
    }

    /**
     * set-varable policy
     * The set-variable policy declares a context variable and assigns
     * it a value specified via an expression or a string literal.
     * if the expression contains a literal it will be converted to a string
     * and the type of the value will be System.String.
     * @example
     * <set-variable name="variable name" value="Expression | String literal" />
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        set(context, `fields.${policyElement.attributes.name}`, tryExecuteFieldValue(policyElement.attributes.value, executionContext));
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}