import { Context } from "../../router";
import { set } from 'lodash';

/**
 * set-varable policy
 * The set-variable policy declares a context variable and assigns
 * it a value specified via an expression or a string literal.
 * if the expression contains a literal it will be converted to a string
 * and the type of the value will be System.String.
 * @example
 * <set-variable name="variable name" value="Expression | String literal" />
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    if(policyElement.name=="set-variable"){
        const variableName: any = (policyElement.attributes.name as { [key: string]: any });
        set(context, `fields.${variableName}`,policyElement.attributes.value);
    }
    return { policyElement, context, scope };
};