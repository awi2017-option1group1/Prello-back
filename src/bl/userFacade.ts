import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { ParamsExtractor } from './paramsExtractorv2'
import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'

import { ValidationException } from './errors/ValidationException'

import { Requester } from './requester'
import { User } from '../entities/user'
import { Password } from './password'

import { sendMail } from '../mail'
import { welcome } from '../mails/welcome'

export class UserFacade {
    static async register(email: string, username: string, uuidToken: string, password?: string): Promise<User>  {
        const user = new User()
        user.email = email
        user.username = username
        user.notificationsEnabled = true
        user.confirmed = false
        user.confirmationToken = uuidToken
        if (password) {
            user.password = Password.encrypt(password)
        }

        const errors = await validate(user, { groups: ['registration'] })
        if (errors.length === 0) {
            const userReturned = await getRepository(User).save(user)
            sendMail(email, welcome(username, userReturned.id, uuidToken))
            return userReturned
        } else {
            throw new ValidationException(errors)
        }
    }

    static async getAll(): Promise<User[]>  {
        return await getRepository(User).find()
    }

    static async getById(requester: Requester, userId: number): Promise<User> {
        requester.shouldHaveUid(userId).orElseThrowError()

        const user = await getRepository(User).findOneById(userId)
        if (user) {
            return user
        } else {
            throw new NotFoundException('User not found')
        }
    }

    static async update(requester: Requester, userId: number, params: {}): Promise<User> {
        try {
            requester.shouldHaveUid(userId).orElseThrowError()

            const extractor = new ParamsExtractor<User>(params).permit(['username', 'email',
                'fullName', 'bio', 'notificationsEnabled', 'password'])

            const userToUpdate = await UserFacade.getById(requester, userId)
            extractor.fill(userToUpdate)

            return await getRepository(User).save(userToUpdate)
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(requester: Requester, userId: number): Promise<void> {
        try {
            requester.shouldHaveUid(userId).orElseThrowError()

            await getRepository(User).removeById(userId)
            return
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async confirm(userId: number, uuidToken: string): Promise<User> {
        try {
            const user = await getRepository(User).findOneById(userId)
            if (user && user.confirmationToken === uuidToken) {
                user.confirmationToken = null
                user.confirmed = true
                return await getRepository(User).save(user)
            } else {
                throw new BadRequest('This page does not exist')
            }
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }
}
