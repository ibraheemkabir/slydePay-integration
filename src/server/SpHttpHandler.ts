import {Injectable} from "ferrum-plumbing";
import {NewRequest, ConfirmRequest} from "../client/Types";
import * as slyde from './../slydePay/ApiCalls'
 
export class SpHttpHandler implements Injectable {
    constructor() { }

    __name__(): string { return ' SpHttpHandler'; }

    async sendMoneyRequest(request: NewRequest): Promise<any> {
        if(!request.userId){
            const response = 'userId is required';
            return {
                errorResponse: response,
                error: 'true'
            };
        }else{
            if(request.type === 'mobilemoney'){
              const response = await slyde.createInvoice(request);
                if(response.success && response.result.payToken){
                  return {
                    orderCode: response.result.orderCode,
                    paymentCode: response.result.paymentCode,
                    payToken: response.result.payToken
                  }
                }else{
                  return {
                    success: false,
                    errorResponse: 'An error occurred while creating transaction, please try again'
                  }
                }
            }else{
              const response = await slyde.createInvoice(request);
              if(response.success && response.result.payToken){
                return {
                  orderCode: response.result.orderCode,
                  paymentCode: response.result.paymentCode,
                  payToken: response.result.payToken,
                  
                }
              }else{
                return {
                  success: false,
                  errorResponse: 'An error occurred while creating transaction, please try again'
                }
              }
            }
          }
      
    }

    async getRequestStatus(request: ConfirmRequest): Promise<any> {
      if(!request.userId){
        const response = 'userId is required';
        return {
            errorResponse: response,
            error: 'true'
        };
      }else{
        const response = await slyde.checkStatus(request.payToken);
        if(response.success && response.result){
          let result = response.result.toString();
          let body;
          switch(result){
            case 'CONFIRMED':
              body = {
                success: true,
                response: 'The transaction has been completed successfully',
                completed: true,
                paymentMethod: "ACCOUNT_TRANSFER",
                createdOn: Date.now()
              }
              break;
            case 'PENDING':
              body = {
                success: true,
                response: 'The transaction is pending',
                completed: false,
                paymentMethod: "ACCOUNT_TRANSFER",
                createdOn: Date.now()
              }
              break;
            case 'NEW':
              body = {
                success: true,
                response: 'The transaction as in sandbox mode',
                completed: false,
                paymentMethod: "ACCOUNT_TRANSFER",
                createdOn: Date.now(),
              }
              break;
            case 'DISPUTED':
            case 'CANCELLED':
              body = {
                success: false,
                response: 'The transaction as been cancelled',
                completed: false,
                paymentMethod: "ACCOUNT_TRANSFER",
                createdOn: Date.now(),
              }
              break;
            default :
              body = {
                success: false,
              }
              break;
          }
          return body;
        }
      }
    }

    async confirmTransaction(request: ConfirmRequest): Promise<any> {
        const response = await slyde.confirmTransaction(request.payToken);
        if(response.success && !response.errorMessage){
          return{
            success: true
          }
        }else{
          return{
            success: false,
            response: response.result,
            paymentMethod: "SLYDE-PAY",
            createdOn: Date.now(),
            amount: response.amount,
            fee: 100.00,
            "currencyCode": "CDS",
            "completedOn": null,
            "paymentStatus": "PAID",
            "payableAmount": response.amount + 100
          }
        }
    }
}