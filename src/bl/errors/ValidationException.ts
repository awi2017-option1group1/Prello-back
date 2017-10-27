import { ValidationError } from 'class-validator'

import { BaseError } from './BaseError'

export interface ValidationErrors {
    field: string
    message: string,
}

export class ValidationException implements BaseError {

    errors: ValidationErrors[] = []

    constructor(vErrors: ValidationError[]) {
        vErrors.forEach(vError => {
            const constraints = vError.constraints
            Object.keys(constraints).forEach(key => {
                this.errors.push({
                    field: vError.property, 
                    message: constraints[key]
                })
            })
        })
    }
}
