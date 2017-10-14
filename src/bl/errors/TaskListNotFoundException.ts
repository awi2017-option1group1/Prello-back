import { BaseError } from './BaseError'

export class TaskListNotFoundException extends BaseError {
    constructor(message: string) {
        super(message)
    }
}
