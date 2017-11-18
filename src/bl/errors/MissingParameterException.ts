import { BaseError } from './BaseError'

export class MissingParameterException implements BaseError {
    constructor(public message: string) {}
}
