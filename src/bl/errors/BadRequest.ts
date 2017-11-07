import { BaseError } from './BaseError'

export class BadRequest implements BaseError {
    constructor(public message: string) {}
}
