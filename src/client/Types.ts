import {tokenType} from '../slydePay/Types';

export interface NewRequest {
    userId: string;
    label: string;
    qrCodeSize?: number;
    option?: string;
    amount: number;
    customerName?: string;
    customerMobileNumber?: number,
    type?: string,
    email?: string
}


export interface ConfirmRequest {
    payToken: tokenType;
    userId: string;
    token: string;
}
