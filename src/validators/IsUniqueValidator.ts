import { getManager } from 'typeorm'

import {
    registerDecorator, 
    ValidationOptions, 
    ValidatorConstraint, 
    ValidatorConstraintInterface,
     ValidationArguments
} from 'class-validator'

export interface IsUniqueOptions {
    /* tslint:disable */
    repository: any,
    /* tslint:enable */
    column: string
}

@ValidatorConstraint({ async: true })
export class UniqueValidatorConstraint implements ValidatorConstraintInterface {

    /* tslint:disable */
    validate(value: any, args: ValidationArguments) {
    /* tslint:enable */
        return getManager().getRepository(args.constraints[0]).findOne({
            [args.constraints[1]]: value
        }).then(result => {
            if (result) {
                return false
            } else {
                return true
            }
        })
    }

}

export function IsUnique(isUniqueOptions: IsUniqueOptions, validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [
                isUniqueOptions.repository,
                isUniqueOptions.column
            ],
            validator: UniqueValidatorConstraint
        })
   }
}
