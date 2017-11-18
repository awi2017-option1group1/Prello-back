import { BaseError } from './BaseError'

import { Requester } from '../requester'

export class UnauthorizedException implements BaseError {
    public message: string
    constructor(requester: Requester) {
        this.message = `Requester '${requester.getUID()} is not authorized to access the resource.'`
    }
}
