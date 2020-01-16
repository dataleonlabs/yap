import PolicyCategory from "./PolicyCategory";
import Scope from "./Scope";

/**
 * YapPolicy decorator
 * Creates policy with pre-defined id, name, category description and scopes
 * @param policyMetadata object, consist of id, name, category description and scopes for newly created Policy
 */
export default function YapPolicy(policyMetadata: {

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
            public category: PolicyCategory = category;

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