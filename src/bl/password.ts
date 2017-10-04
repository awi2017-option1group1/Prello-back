import * as bcrypt from 'bcrypt-nodejs'

export class Password {
    static encrypt(password: string) {
        bcrypt.genSalt(10, function(saltGenerationError: Error, salt: string) {
            if (saltGenerationError) {
                console.log('Error while generating hash : ', saltGenerationError)
            } else {
                bcrypt.hash(password, salt, function(hashError: Error, hash: string) {
                    if (hashError) {
                        console.log('Error while hashing password : ', hashError)
                        return
                    } else {
                        return hash
                    }
                })
            }

        })
    }
}
