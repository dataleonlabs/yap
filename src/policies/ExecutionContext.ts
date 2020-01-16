import { Context } from "..";
import Scope from "./Scope";

/**
 * Execution context interface
 */
export default interface ExecutionContext {
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
