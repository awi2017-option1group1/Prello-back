import { getEntityManager } from 'typeorm'

import { UserNotFoundException } from './errors/UserNotFoundException'
import { User } from '../entities/user'
import { Password } from './password'

export class UserFacade {
    static async authenticate(email: string, password: string): Promise<User>  {
        const user = await getEntityManager()
                            .getRepository(User)
                            .findOne({
                                email: email,
                                password: Password.encrypt(password)
                            })
        if (user) {
            return user
        } else {
            throw new UserNotFoundException('Password and email did not match')
        }
    }
}
