import * as bcrypt from 'bcrypt-nodejs'

export class Password {
    static encrypt(password: string) {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    static compare(textPassword: string, hashPassword: string) {
        return bcrypt.compareSync(textPassword, hashPassword)
    }
}
