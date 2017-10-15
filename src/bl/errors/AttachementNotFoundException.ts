import { BaseError } from './BaseError'

export class AttachementNotFoundException extends BaseError {
    constructor(message: string) {
        super(message)
    }
}
