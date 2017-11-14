import { getManager, getRepository } from 'typeorm'
import { validate } from 'class-validator'

import * as uuid from 'uuid/v5'

import { ParamsExtractor } from './paramsExtractorv2'
import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'

import { ValidationException } from './errors/ValidationException'

import { User } from '../entities/user'
import { Password } from './password'

import { sendMail } from '../mail'
import { welcome } from '../mails/welcome'
import { resetPassword } from '../mails/resetPassword'

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

    static async getAllFromTeamId(teamId: number): Promise<User[]> {
        return await getRepository(User).find()
    }

    static async getById(userId: number): Promise<User> {
        const user = await getRepository(User).findOneById(userId)
        if (user) {
            return user
        } else {
            throw new NotFoundException('User not found')
        }
    }

    static async getByEmail(email: string): Promise<User> {
        const user = await getRepository(User).findOne({email: email})
        if (user) {
            return user
        } else {
            throw new NotFoundException('User not found')
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
            const extractor = new ParamsExtractor<User>(params).permit(['username', 'email',
                'fullName', 'bio', 'notificationsEnabled', 'password'])

            const userToUpdate = await UserFacade.getById(userId)
            extractor.fill(userToUpdate)

            return await getRepository(User).save(userToUpdate)
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async confirm(userId: number, uuidToken: string): Promise<User> {
        try {
            const user = await UserFacade.getById(userId)
            if (user.confirmationToken === uuidToken) {
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

    static async reset(email: string): Promise<User> {
        if (!email) {
            throw new BadRequest('This user does not exist')
        }
        try {
            const user = await UserFacade.getByEmail(email)
            const token = uuid('photon.igpolytech.fr', uuid.DNS)
            user.resetToken = token
            user.resetTimeStamp = new Date()
            console.log(user.resetTimeStamp)

            sendMail(email, resetPassword(user.username, user.id, token))
            
            return await getRepository(User).save(user)
        } catch (e) {
            throw new BadRequest(e)
        }

    }

    static async checkResetToken(userID: number, token: string): Promise<User> {
        try {
            const user = await UserFacade.getById(userID)
            const timeDifference = user.resetTimeStamp ? user.resetTimeStamp.getTime() - new Date().getTime() : 10000000

            if (user.resetToken === token && timeDifference < 600) { // 10 minutes
                return user
            } else {
                throw new NotFoundException('Page not found')
            }
        } catch (e) {
            throw new BadRequest(e)
        }
    }

    static async updatePassword(userID: number, token: string, newPassword: string): Promise<User> {
        try {
            const user = await UserFacade.checkResetToken(userID, token)
            if (user) {
                user.resetToken = null
                user.resetTimeStamp = null
                user.password = Password.encrypt(newPassword)
                return await getRepository(User).save(user)
            } else {
                throw new BadRequest('This page does not exist')
            }
        } catch (e) {
            throw new BadRequest(e)
        }
    }
}
