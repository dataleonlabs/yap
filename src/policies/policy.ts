import { Context } from "..";

/**
 * Execution context interface
 */
export interface ExecutionContext {
    /**
     * Policy element, which contains policy data
     */
    policyElement: any;

    /**
     * Request context
     */
    context: Context;

    /**
     * Request scope
     */
    scope: Scope;
}

/**
 * Policy categories enum
 */
export enum PolicyCategory {
    'undefined' = 'undefined',
    'accessrestriction' = 'accessRestriction',
    'advanced' = 'advanced',
    'authentification' = 'authentification',
    'cors' = 'cors',
    'transformation' = 'transformation',
}

/**
 * Policy scope enum
 */
export enum Scope { inbound = "inbound", outbound = "outbound", onerror = "on-error" }

/**
 * Encapsulates basic class for Yap policies
 */
export default class Policy {

    constructor(
        id: string = "",
        name: string = "",
        category: PolicyCategory = PolicyCategory.undefined,
        description: string = "",
        scopes: Scope[] = []) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.scopes = scopes;
    }

    /**
     * String identificator for policy. Used to match policy-name with policy body
     */
    public readonly id: string;

    /**
     * Name of a policy
     */
    public readonly name: string;

    /**
     * Category of a policy
     */
    public readonly category: PolicyCategory;

    /**
     * Descritpion of a policy
     */
    public readonly description: string;

    /**
     * Acceptable scopes for a policy.
     */
    public readonly scopes: Scope[];

    /**
     * Used to validate whether policyElement can be accepted by core
     * @param policyElement - policy element in a format of JS object
     */
    public validate(policyElement: object): string[] {
        throw new Error("Method validate is not implemented");
    }

    /**
     * Applies policy to context
     * @param policyElement  - policy element in a format of JS object
     * @param context - execution context
     * @param scope - execution scope
     */
    public apply(executionContext: ExecutionContext): Promise<ExecutionContext> {
        throw new Error("Method apply is not implemented");
    }
}

/**
 * Execution context interface
 */
export interface ExecutionContext {
    /**
     * Policy element, which contains policy data
     */
    policyElement: any;

    /**
     * Request context
     */
    context: Context;

    /**
     * Request scope
     */
    scope: Scope;
}

/**
 * YapPolicy decorator
 * Creates policy with pre-defined id, name, category description and scopes
 * @param policyMetadata object, consist of id, name, category description and scopes for newly created Policy
 */
export function YapPolicy(policyMetadata: {

    /**
     * String identificator for policy. Used to match policy-name with policy body
     */
    id: string,

    /**
     * Name of a policy
     */
    name: string,

    /**
     * Category of a policy
     */
    category: PolicyCategory,

    /**
     * Descritpion of a policy
     */
    description: string,

    /**
     * Request scope
     */
    scopes: Scope[],
}) {
    const { id, name, category, description, scopes } = policyMetadata;

    return <T extends new (...args: any[]) => {}>(constructor: T) => {
        // tslint:disable-next-line: max-classes-per-file
        return class extends constructor {

            /**
             * String identificator for policy. Used to match policy-name with policy body
             */
            public id: string = id;

            /**
             * Name of a policy
             */
            public name: string = name;

            /**
             * Category of a policy
             */
            public category: string = category;

            /**
             * Descritpion of a policy
             */
            public description: string = description;

            /**
             * Request scope
             */
            public scopes: Scope[] = scopes;
        };
    };
}
