import { getManager, getRepository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { ParamsExtractor } from './paramsExtractor'
import { UserNotFoundException } from './errors/UserNotFoundException'
import { User } from '../entities/user'
import { Password } from './password'

export class UserFacade {
    static async authenticate(email: string, password: string): Promise<User>  {
        const userRepository = await getManager().getRepository(User)
        const user = await userRepository.findOne({
            email
        })
        if (user && Password.compare(password, user.password)) {
            if (!user.token) {
                user.token = uuidv4()
                await userRepository.save(user)
            }
            return user
        } else {
            throw new UserNotFoundException('Password and email did not match')
        }
    }

    static async getAll(): Promise<User[]>  {
        const users = await getRepository(User)
                            .find()
        if (users) {
            return users
        } else {
            throw new UserNotFoundException('No User was found')
        }
    }

    static async getAllFromTeamId(teamId: number): Promise<User[]> {
        const users = await getManager()
                            .getRepository(User)
                            .find()
        if (users) {
            return users
        } else {
            throw new UserNotFoundException('No User was found')
        }
    }

    static async getById(userId: number): Promise<User> {
        const user = await getManager()
                            .getRepository(User)
                            .findOneById(userId)
        if (user) {
            return user
        } else {
            throw new UserNotFoundException('No User was found')
        }
    }

    static async delete(userId: number): Promise<boolean> {
        try {
            const userToDelete = await UserFacade.getById(userId)
            const deletedUser = await getManager()
                    .getRepository(User)
                    .remove(userToDelete)
            if (deletedUser) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new UserNotFoundException(e)
        }
    }

    static async update(userReceived: User, userToUpdate: User): Promise<User> {
        try {
            const userToSave = ParamsExtractor.extract<User>(['firstname', 'lastname', 'biography',
                                                             'notificationsEnabled', 'email', 'password', 'token'],
                                                             userReceived, userToUpdate)

            const repository = getManager().getRepository(User)
            return repository.save(userToSave)
        } catch (e) {
            throw new UserNotFoundException(e)
        }
    }

    static async create(user: User): Promise<User> {
        try {
            let userToCreate = new User()
            userToCreate = ParamsExtractor.extract<User>(['firstname', 'lastname', 'biography',
                                                         'notificationsEnabled', 'email', 'password', 'token'],
                                                         user, userToCreate)
            return getManager().getRepository(User).save(userToCreate)
        } catch (e) {
            throw new UserNotFoundException(e)
        }
    }

}
