import { BaseError } from './BaseError'

export class NotFoundException extends BaseError {
    constructor(message: string) {
        super(message)
    }
}
