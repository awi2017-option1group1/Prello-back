import * as bcrypt from 'bcrypt-nodejs'

export class Password {
    static encrypt(password: string) {
        try {
            var salt = bcrypt.genSaltSync(10)
            return bcrypt.hashSync(password, salt)
        } catch (hashError) {
            console.log('Error while hashing password : ', hashError)
            return
        }
    }
}
