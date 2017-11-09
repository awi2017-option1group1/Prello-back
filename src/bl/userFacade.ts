import { getManager, getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { ParamsExtractor } from './paramsExtractorv2'
import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'

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
        console.log(userId)
        const user = await getRepository(User)
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

    static async update(userId: number, params: {}): Promise<User> {
        try {
            const extractor = new ParamsExtractor<User>(params).permit(['username', 'email'])

            const userToUpdate = await UserFacade.getById(userId)
            extractor.fill(userToUpdate)

            return await getRepository(User).save(userToUpdate)
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

}
