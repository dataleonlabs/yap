/**
 * Interface for response object
 */
export default interface Response {
    /** body */
    body?: any;
    /** statusCode */
    statusCode?: number;
    /** headers */
    headers?: { [key: string]: any };
}
