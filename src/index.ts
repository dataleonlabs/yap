import { APIGatewayEvent } from "aws-lambda";
import Router, { Context } from './router';

export default class Yap {

    private router: Router;

    get Router() {
        return this.router;
    }

    constructor() {
        this.router = new Router();
    }

    public async executeAWS(awsEvent: APIGatewayEvent) {
        const context = {
            request: awsEvent,
            response: {}, 
            fields: {}, 
            connection: {}
        }
        return await this.execute(context);
    }

    public async execute(context:Context) {
        this.router.Context = context;
        return await this.router.getResponse();

    }

    public get(path: string, action: any) {
        this.router.register('GET', path, action)
    }

    public post(path: string, action: any) {
        this.router.register('POST', path, action)
    }

    public put(path: string, action: any) {
        this.router.register('PUT', path, action)
    }

    public delete(path: string, action: any) {
        this.router.register('DELETE', path, action)
    }
}