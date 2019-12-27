import { APIGatewayEvent } from "aws-lambda";
import Router, { Context, Request } from './router';

/**
 * Yap api gateway
 */
export default class Yap {

    /**
     * Instance of request router
     */
    private router: Router;

    /**
     * Router instance getter
     */
    get Router() {
        return this.router;
    }

    constructor() {
        this.router = new Router();
    }

    /**
     * Request handler for AWS Labdas
     * @param awsEvent - AWS lambda event
     */
    public async handler(awsEvent: APIGatewayEvent) {
        return this.execute(awsEvent);
    }

    /**
     * Method to execute incoming request
     * @param request Incomig request
     */
    public async execute(request: Request) {
        const context: Context = {
            request,
            response: {},
        };
        this.router.Context = context;
        return this.router.getResponse();
    }

    /**
     * Register route for get request
     * @param path Path to match
     * @param action Action to execute
     */
    public get(path: string, action: any) {
        this.router.register('GET', path, action);
    }

    /**
     * Register route for post request
     * @param path Path to match
     * @param action Action to execute
     */
    public post(path: string, action: any) {
        this.router.register('POST', path, action);
    }

    /**
     * Register route for put request
     * @param path Path to match
     * @param action Action to execute
     */
    public put(path: string, action: any) {
        this.router.register('PUT', path, action);
    }

    /**
     * Register route for delete request
     * @param path Path to match
     * @param action Action to execute
     */
    public delete(path: string, action: any) {
        this.router.register('DELETE', path, action);
    }

    /**
     * Register route for all types of request
     * @param path Path to match
     * @param action Action to execute
     */
    public all(path: string, action: any) {
        this.router.register(null, path, action);
    }
}