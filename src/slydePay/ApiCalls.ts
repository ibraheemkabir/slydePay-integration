import {MerchantCredentials} from './Types';
import {tokenType} from './Types';
import axios from 'axios';
import uuid from 'uuid-random';
import { integer } from 'aws-sdk/clients/cloudfront';

interface args {
    type?: string,
    amount: integer,
    payOption?: string,
    customerName?: string,
    customerMobileNumber?: integer,
    customerEmail?: string
}

export const createInvoice = async (req: args) => {
    const {type,amount,payOption,customerName,customerMobileNumber,customerEmail} = req;
    if(type === "mobilemoney"){
        const send = await axios.post('https://app.slydepay.com.gh/api/merchant/invoice/create',
        {
            "emailOrMobileNumber": MerchantCredentials.emailOrMobileNumber,
            "merchantKey": MerchantCredentials.merchantKey,
            "amount": amount,
            "orderCode": uuid(),
            "sendInvoice": true,
            payOption,
            customerName,
            customerMobileNumber
        }).then(
            (res: any) => {            
                console.log(res);
                return res.data}
        ).catch(
            (error)=> {throw new Error()}
        )
        return send;
    }else{
        const send = await axios.post('https://app.slydepay.com.gh/api/merchant/invoice/create',
        {
            "emailOrMobileNumber": MerchantCredentials.emailOrMobileNumber,
            "merchantKey": MerchantCredentials.merchantKey,
            "amount": amount,
            "orderCode": uuid(),
            "payOption": "SLYDEPAY",
             customerName,
             customerEmail,
             sendInvoice: true
        }).then(
            (res: any) => {console.log(res); return res.data}
        ).catch(
            (error)=> {throw new Error()}
        )
        return send;
    }
}

export const checkStatus = async (payToken: tokenType) => {
    const status = await axios.post('https://app.slydepay.com.gh/api/merchant/invoice/checkstatus',{
        "emailOrMobileNumber": MerchantCredentials.emailOrMobileNumber,
        "merchantKey": MerchantCredentials.merchantKey,
        "payToken": payToken,
        "confirmTransaction": true
    }).then(
        (res: any) => {return res.data}
    ).catch(
        (error)=> {throw new Error()}
    )
    return status;
}
   


export const confirmTransaction = async (payToken: tokenType) => {
    const confirm = await axios.post('https://app.slydepay.com.gh/api/merchant/transaction/confirm',{
        "emailOrMobileNumber": MerchantCredentials.emailOrMobileNumber,
        "merchantKey": MerchantCredentials.merchantKey,
        "payToken": payToken
    }).then(
        (res: any) => {        
            return res.data
        }
    ).catch(
        (error)=> {throw new Error()}
    );
    return confirm;
}
   
