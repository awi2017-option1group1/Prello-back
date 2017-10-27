import { BaseError } from './BaseError'

export class NotFoundException implements BaseError {
    constructor(public message: string) {}
}
