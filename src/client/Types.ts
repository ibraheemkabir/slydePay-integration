import {tokenType} from '../slydePay/Types';


export interface TotpSeed {
    userId: string;
    secret: string;
    qrCode: string;
    totpUrl: string;
    createdAt: number;
}

export interface NewSeedRequest {
    userId: string;
    label: string;
    qrCodeSize?: number;
    option?: string;
    amount: number;
    customerName?: string;
    customerMobileNumber?: string,
    type?: string,
    email?: string
}

export interface NewSeedResult {
    seed: TotpSeed;
    error?: string;
}

export interface VerifyTokenRequest {
    payToken: tokenType;
    userId: string;
    token: string;
}

export interface VerifyTokenResult {
    verified: boolean;
    error?: string;
}

