import { ValidationUtils} from "ferrum-plumbing";
require('dotenv').config();



export function getEnv(env: string) {
    const res = process.env[env];
    ValidationUtils.isTrue(!!res, `Make sure to set environment variable '${env}'`);
    return res!;
}

export const context = {
    awsRequestId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
    callbackWaitsForEmptyEventLoop: true,
    getRemainingTimeInMillis: function(){},
    functionName: '',
    functionVersion: '',
    memoryLimitInMB: '',
    logGroupName: '',
    logStreamName: '',
    clientContext: null,
    identity: null
  }