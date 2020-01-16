import Request from "./Request";
import Response from "./Response";

/**
 * Interface for context object
 */
export default interface Context {
    /** request */
    request: Request;

    /** response */
    response: Response;

    /** next function */
    next?: () => void;

    /** throw */
    throw?: (statusCode: number, body: any) => void;

    /** Fields */
    readonly fields?: { [key: string]: any };

    /** Connection */
    readonly connection?: { [key: string]: any };

    /** Variables */
    readonly variables?: { [key: string]: any };

    /** Last execution error */
    LastError?: Error;
}
