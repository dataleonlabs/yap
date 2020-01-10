import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export class testApi {
    constructor() {

    }

    async handle(awsEvent: APIGatewayProxyEvent, awsContext: Context): Promise<APIGatewayProxyResult> {
        const bodyString = awsEvent.body || ""; 
        return new Promise<APIGatewayProxyResult>(res => res({ statusCode: 200, body: JSON.parse(bodyString) }))
    }
}