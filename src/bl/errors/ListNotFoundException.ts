import { BaseError } from './BaseError'

export class ListNotFoundException extends BaseError {
    constructor(message: string) {
        super(message)
    }
}
