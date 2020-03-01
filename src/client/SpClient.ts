import {Injectable, JsonRpcClient, JsonRpcRequest, SecretAuthProvider} from 'ferrum-plumbing';
import {NewSeedRequest, NewSeedResult, VerifyTokenRequest, VerifyTokenResult} from "./Types";
import {context} from './../server/utils';
import {handler} from '../..';

export class slidePayClient implements Injectable {
    constructor(private client: JsonRpcClient) { }

    __name__(): string { return 'slidePayClient'; }

    async sendMoneyRequest(request: NewSeedRequest): Promise<any> {
        const httpRequest = {
            command: 'sendMoneyRequest',
            params: [],
            data: request,
        } as JsonRpcRequest;

        return handler(httpRequest,context)
    }

    async getRequestStatus(request: VerifyTokenRequest): Promise<any> {
        const httpRequest = {
            command: 'confirmRequestStatus',
            params: [],
            data: request,
        } as JsonRpcRequest;
        return handler(httpRequest,context)

    }

    async confirmTransaction(request: VerifyTokenRequest): Promise<any> {
        const httpRequest = {
            command: 'confirmTransaction',
            params: [],
            data: request,
        } as JsonRpcRequest;

        return handler(httpRequest,context)

    }
}

export function newTotpClient(endpoint: string, secret: string) {
    endpoint = `${process.env.KUDI_ENDPOINT}'/api/slydepayHook'`
    const rpcClient = new JsonRpcClient(endpoint, '', '', new SecretAuthProvider(secret));
    return new slidePayClient(rpcClient);
}