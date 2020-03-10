import {LambdaHttpRequest, LambdaHttpResponse} from "aws-lambda-helper";
import {LambdaHttpHandler} from "aws-lambda-helper/dist/HandlerFactory";
import {SpHttpHandler} from "./SpHttpHandler";
import {AuthenticationVerifyer, JsonRpcRequest} from "ferrum-plumbing";

export class HttpHandler implements LambdaHttpHandler {
    constructor(private spHandler: SpHttpHandler, private authVerifyer: AuthenticationVerifyer) { }

    async handle(request: LambdaHttpRequest, context: any): Promise<LambdaHttpResponse> {
        
        if (!this.authVerifyer.isValid(request.headers)) {
            return {
                body: 'Bad secret',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'text/html',
                },
                isBase64Encoded: false,
                statusCode: 400,
            };
        }
        let body: any = undefined;
        const req = JSON.parse(request.body) as JsonRpcRequest;
        switch (req.command) {
            case 'sendMoneyRequest':
                body = await this.spHandler.sendMoneyRequest(req.data as any);
                console.log(body)
                break;
            case 'confirmRequestStatus':
                body =  await this.spHandler.getRequestStatus(req.data as any);
                break;
            case 'confirmTransaction':
                body =  await this.spHandler.confirmTransaction(req.data as any);
                break;
            default:
                body = { error: 'bad request' }
        }
        return {
            body: JSON.stringify(body),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'X-Secret': process.env.KUDI_ENDPOINT_SECRET
            },
            isBase64Encoded: false,
            statusCode: 200,
        } as LambdaHttpResponse;
    }
}