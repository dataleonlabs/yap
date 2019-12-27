import { get, set } from 'lodash';
import { Context } from "../../router";
import { ExecutionContext, IPolicy, PolicyCategory, Scope } from "../index";

/**
 * authentication-basic policy
 * Use the authentication-basic policy to authenticate with a backend
 * service using Basic authentication. This policy effectively sets
 * the HTTP Authorization header to the
 * value corresponding to the credentials provided in the policy.
 * @example
 * <authentication-basic username="username" password="password" />
 */
export default class AuthenticationBasic implements IPolicy {

    /**
     * Policy id
     */
    public get id() {
        return 'authentication-basic';
    }

    /**
     * Policy name
     */
    public get name() {
        return 'Authentication basic policy';
    }

    /**
     * Policy category
     */
    public get category() {
        return PolicyCategory.authentification;
    }

    /**
     * Policy description
     */
    public get description() {
        return "Use the authentication-basic policy to authenticate with a backend service using Basic authentication.";
    }

    /**
     * Policy available scopes
     */
    public get scopes() {
        return [Scope.inbound];
    }

    /**
     * If policy is YAP internal policy
     */
    public get isInternal() {
        return true;
    }

    /**
     * Applies authentication basic policy
     * @param executionContext execution context
     */
    public async apply(executionContext: ExecutionContext) {
        const { policyElement, context, scope } = executionContext;
        const data = `${policyElement.attributes.username}:${policyElement.attributes.password}`;
        const buff = new Buffer(data);
        const base64data = buff.toString('base64');
        set(context, 'request.headers.Authorization', `Basic ${base64data}`);
        return executionContext;
    }

    /**
     * Validates authentication basic policy
     * @param policyElement policy element
     */
    public validate(policyElement: any) {
        const errors = [];
        const name = get(policyElement, 'attributes.username');
        const password = get(policyElement, 'attributes.password');
        if(!name) {
            errors.push(`${this.id}-ERR-001: username should be set in attributes, for example username="username"`);
        }
        if(!password) {
            errors.push(`${this.id}-ERR-002: password should be set in attributes, for example password="password"`);
        }
        return errors;
    }
}
