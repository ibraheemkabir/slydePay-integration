import {Injectable, ConsoleLogger} from "ferrum-plumbing";
import {NewSeedRequest, NewSeedResult, VerifyTokenRequest, VerifyTokenResult} from "../client/Types";
import {SecureKeyValueStore} from "./SecureKeyValueStore";
import * as slyde from './../slydePay/ApiCalls'
 
export class SpHttpHandler implements Injectable {
    constructor(private secureStore: SecureKeyValueStore) { }

    __name__(): string { return ' SpHttpHandler'; }

    async sendMoneyRequest(request: NewSeedRequest): Promise<any> {
        if(!request.userId){
            const response = 'userId is required';
            return {
                errorResponse: response,
                error: 'true'
            };
        }else{
            if(request.type === 'mobilemoney'){
              const response = await slyde.createInvoice(
                request.type,
                request.amount,
                request.option,
                request.customerName,
                request.customerMobileNumber,
                );
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
              const response = await slyde.createInvoice(
                request.type,
                request.amount,
                request.option,
                request.customerName,
                request.customerMobileNumber,
                request.email
              );
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

    async getRequestStatus(request: VerifyTokenRequest): Promise<any> {
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
                createdOn: Date.now(),
                amount: 1200.00,
                fee: 10.00,
                "currencyCode": "CDS",
                "completedOn": Date.now(),
                "customerName": "Dummy man",
                "customerEmail": "s1@sw.com",
                "paymentDescription": "Dummy man",
                "paymentStatus": "PAID",
                "transactionReference": "MNFY|20191104230025|000273",
                "paymentReference": "MNFY|20191104230025|000273",
                "metaData": null,
                "payableAmount": 1200.0
              }
              break;
            case 'PENDING':
              body = {
                success: true,
                response: 'The transaction is pending',
                completed: false,
                paymentMethod: "ACCOUNT_TRANSFER",
                createdOn: Date.now(),
                amount: 1200.00,
                fee: 10.00,
                "currencyCode": "CDS",
                "completedOn": Date.now(),
                "customerName": "Dummy man",
                "customerEmail": "s1@sw.com",
                "paymentDescription": "Dummy man",
                "paymentStatus": "PAID",
                "transactionReference": "MNFY|20191104230025|000273",
                "paymentReference": "MNFY|20191104230025|000273",
                "metaData": null,
                "payableAmount": 1200.0
              }
              break;
            case 'NEW':
              body = {
                success: true,
                response: 'The transaction is in sandbox mode',
                completed: false,
                paymentMethod: "ACCOUNT_TRANSFER",
                createdOn: Date.now(),
                amount: 1200.00,
                fee: 10.00,
                "currencyCode": "CDS",
                "completedOn": null,
                "customerName": "Dummy man",
                "customerEmail": "s1@sw.com",
                "paymentDescription": "Dummy man",
                "paymentStatus": "PAID",
                "transactionReference": "MNFY|20191104230025|000273",
                "paymentReference": "MNFY|20191104230025|000273",
                "metaData": null,
                "payableAmount": 1200.0
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
                amount: 1200.00,
                fee: 10.00,
                "currencyCode": "CDS",
                "completedOn": null,
                "customerName": "Dummy man",
                "customerEmail": "s1@sw.com",
                "paymentDescription": "Dummy man",
                "paymentStatus": "PAID",
                "transactionReference": "MNFY|20191104230025|000273",
                "paymentReference": "MNFY|20191104230025|000273",
                "metaData": null,
                "payableAmount": 1200.0
              }
              break;
            default :
              body = {
                success: true,
              }
              break;
          }
          return body;
        }
      }
    }

    async confirmTransaction(request: VerifyTokenRequest): Promise<any> {
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
            amount: 1200.00,
            fee: 10.00,
            "currencyCode": "CDS",
            "completedOn": null,
            "paymentStatus": "PAID",
            "payableAmount": 1200.0
          }
        }
    }
}