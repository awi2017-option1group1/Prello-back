import { BaseError } from './BaseError'

export class CardNotFoundException extends BaseError {
    constructor(message: string) {
        super(message)
    }
}
