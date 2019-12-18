import { Context } from "../../router";

/**
 * set-varable policy
 * The find-and-replace policy finds a
 * request or response substring and replaces it with a different substring.
 * @example
 * <find-and-replace from="what to replace" to="replacement" />
 * <find-and-replace from="notebook" to="laptop" />
 */
export default (policyElement: any, context: Context, scope: 'inbound' | 'outbound' | 'on-error') => {
    
    if (policyElement.name == "find-and-replace") {
        
        const stringToReplace = policyElement.attributes.from;
        const newString = policyElement.attributes.to;

        const { body = {} }: any = context.request;
        const { data = {} }: any = context.response;
        if (body instanceof Object && body && Object.keys(body).length > 0) {
            for (let key in body) {
                if(!key){
                    continue;
                }
                if(key && typeof body[key] === 'string'){
                    body[key] = body[key].replace(stringToReplace, newString);
                }
                if (key.includes(stringToReplace)) {
                    body[key.replace(stringToReplace, newString)] = body[key];
                    delete body[key];
                }
            }
        }
        if (data instanceof Object && data && Object.keys(data).length > 0) {
            for (let key in data) {
                if(!key){
                    continue;
                }
                if(key && typeof data[key] === 'string'){
                    data[key].replace(stringToReplace, newString);
                }
                if (key.includes(stringToReplace)) {
                    data[key.replace(stringToReplace, newString)] = data[key];
                    delete data[key];
                }
            }
        }
    }
    return { policyElement, context, scope };
};