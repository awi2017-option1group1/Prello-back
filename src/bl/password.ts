import * as bcrypt from 'bcrypt-nodejs'

export class Password {
    static encrypt(password: string) {
        bcrypt.genSalt(10, function(err: Error, salt: string) {
            bcrypt.hash(password, salt, function(err2: Error, hash: string) {
                return hash
            })
        })
    }
}
