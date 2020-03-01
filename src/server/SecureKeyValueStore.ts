import {KeyValueStore} from "ferrum-plumbing";

// TODO: Implement
// You need to set up storage and provide relevant configurations. Firestore can be an option.
// Bonus: encrypt / decrypt data using AWS KMS before storage
export class SecureKeyValueStore implements KeyValueStore {
    constructor() {
    }

    __name__(): string { return 'SecureKeyValueStore'; }


    getItem<T>(k: string): any {
        // TODO: Get an item and decrypt
        return ;
    }

    removeItem<T>(k: string): any {
        return undefined;
    }

    setItem<T>(k: string, value: T): any {
        // TODO: Encrypt and save item
        return undefined;
    }
}