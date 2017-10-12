import { getEntityManager } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { UserNotFoundException } from './errors/UserNotFoundException'
import { User } from '../entities/user'
import { Password } from './password'

export class UserFacade {
    static async authenticate(email: string, password: string): Promise<User>  {
        const userRepository = await getEntityManager().getRepository(User)
        const user = await userRepository.findOne({
            email
        })
        if (user && Password.compare(password, user.password)) {
            if (!user.token) {
                user.token = uuidv4()
                await userRepository.persist(user)
            }
            return user
        } else {
            throw new UserNotFoundException('Password and email did not match')
        }
    }
}
