import { BaseError } from './BaseError'

export class TaskNotFoundException extends BaseError {
    constructor(message: string) {
        super(message)
    }
}
