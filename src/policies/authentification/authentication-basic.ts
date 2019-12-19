import { set } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy } from "../index";

export default class AuthenticationBasic implements IPolicy {

    public get id() {
        return 'authentication-basic';
    }

    /**
     * authentication-basic policy
     * Use the authentication-basic policy to authenticate with a backend
     * service using Basic authentication. This policy effectively sets
     * the HTTP Authorization header to the
     * value corresponding to the credentials provided in the policy.
     * @example
     * <authentication-basic username="username" password="password" />
     */
public async apply(executionContext:ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const data = `${policyElement.attributes.username}:${policyElement.attributes.password}`;
        const buff = new Buffer(data);
        const base64data = buff.toString('base64');
        set(context,'request.headers.Authorization', `Basic ${base64data}`);
        return executionContext;
    }

    public validate(policyElement: any) {
        return true;
    }
}
