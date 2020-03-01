import {Container, Module, SecretAuthProvider, ValidationUtils} from 'ferrum-plumbing';
import {SecureKeyValueStore} from "./SecureKeyValueStore";
import {HttpHandler} from "./HttpHandler";
import {SpHttpHandler} from "./SpHttpHandler";
import { AwsEnvs,SecretsProvider, MongooseConfig } from 'aws-lambda-helper';
import {getEnv} from './utils';



export class ServerModule implements Module {
    async configAsync(container: Container) {
        const region = process.env[AwsEnvs.AWS_DEFAULT_REGION] || 'us-east-2';
        const secretsHandlerConfArn = getEnv(AwsEnvs.AWS_SECRET_ARN_PREFIX + 'ADDRESS_HANDLER');
        const secretsHandlerConfig = await new SecretsProvider(region, secretsHandlerConfArn).get() as
        MongooseConfig&{secret: string, cmkKeyArn: string};
        const serverSecret = process.env.SECRET;
        ValidationUtils.isTrue(!!serverSecret, 'Environment variables "SECRET" must be provided');
        container.register('LambdaHttpHandler',
                c => new HttpHandler(c.get(SpHttpHandler),new SecretAuthProvider(secretsHandlerConfig.secret)));
        container.register("LambdaSqsHandler", () => new Object());
        container.register(SecureKeyValueStore, c => new SecureKeyValueStore());
        container.register(SpHttpHandler, c => new SpHttpHandler(c.get(SecureKeyValueStore)));
    }
}