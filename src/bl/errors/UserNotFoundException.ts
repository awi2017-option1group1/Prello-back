import { BaseError } from './BaseError'

export class UserNotFoundException extends BaseError {
    constructor(message: string) {
        super(message)
    }
}
