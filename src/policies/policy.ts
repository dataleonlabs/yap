import { Context } from "..";
import ExecutionContext from "./executioncontext";
import PolicyCategory from "./PolicyCategory";
import Scope from "./Scope";

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
