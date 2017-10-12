import { BaseError } from './BaseError'

export class BoardNotFoundException extends BaseError {
    constructor(message: string) {
        super(message)
    }
}
