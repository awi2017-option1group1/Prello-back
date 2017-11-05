import { getManager, getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { ParamsExtractor } from './paramsExtractor'
import { NotFoundException } from './errors/NotFoundException'

import { ValidationException } from './errors/ValidationException'

import { User } from '../entities/user'
import { Password } from './password'

export class UserFacade {
    static async register(email: string, username: string, password?: string): Promise<User>  {
        const user = new User()
        user.email = email
        user.username = username 
        user.notificationsEnabled = true
        user.confirmed = false
        if (password) {
            user.password = Password.encrypt(password)
        }

        const errors = await validate(user, { groups: ['registration'] })
        if (errors.length === 0) {
            return getManager().save(user)
        } else {
            throw new ValidationException(errors)
        }
    }

    static async getAll(): Promise<User[]>  {
        const users = await getRepository(User)
                            .find()
        if (users) {
            return users
        } else {
            throw new NotFoundException('No User was found')
        }
    }

    static async getAllFromTeamId(teamId: number): Promise<User[]> {
        const users = await getManager()
                            .getRepository(User)
                            .find()
        if (users) {
            return users
        } else {
            throw new NotFoundException('No User was found')
        }
    }

    static async getById(userId: number): Promise<User> {
        const user = await getManager()
                            .getRepository(User)
                            .findOneById(userId)
        if (user) {
            return user
        } else {
            throw new NotFoundException('No User was found')
        }
    }

    static async delete(userId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(User)
                    .removeById(userId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(userReceived: User): Promise<void> {
        try {
            const userToSave = ParamsExtractor.extract<User>(['firstname', 'lastname', 'biography',
                                                             'notificationsEnabled', 'email', 'password', 'token'],
                                                             userReceived)
            const repository = getManager().getRepository(User)
            return repository.updateById(userReceived.id, userToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

}
