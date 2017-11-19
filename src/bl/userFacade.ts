import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import * as uuid from 'uuid/v4'

import { ParamsExtractor } from './paramsExtractorv2'
import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'

import { ValidationException } from './errors/ValidationException'

import { Requester } from './requester'
import { randomColor, User } from '../entities/user'
import { Password } from './password'

import { BoardFacade } from '../bl/boardFacade'
import { ListFacade } from '../bl/listFacade'
import { CardFacade } from '../bl/cardFacade'
import { sendMail } from '../mail'
import { welcome } from '../mails/welcome'
import { resetPassword } from '../mails/resetPassword'

export class UserFacade {
    static async register(email: string, username: string, uuidToken: string, password?: string): Promise<User>  {
        const user = new User()
        user.email = email
        user.username = username
        user.notificationsEnabled = true
        user.avatarColor = randomColor()
        if (password) {
            user.password = Password.encrypt(password)
            user.confirmed = false
            user.confirmationToken = uuidToken
        } else {
            user.confirmed = true
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

    static async getByEmail(email: string): Promise<User> {
        const user = await getRepository(User).findOne({email: email})
        if (user) {
            return user
        } else {
            throw new NotFoundException('User not found')
        }
    }

    static async getByUsername(username: String): Promise<User> {
        const user = await getRepository(User).findOne({
            where: {
                username: username
            }
        })
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

    static async search(userID: number, value: string): Promise<Object> {
        try {
            const results = {
                boards: {
                    name: 'boards', 
                    results: await BoardFacade.search(value),
                },

                lists: {
                    name: 'lists', 
                    results: await ListFacade.search(value),
                },
                
                cards: {
                    name: 'cards', 
                    results: await CardFacade.search(value),
                },
            
            }
            return results
            
        } catch (e) {
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
            const user = await getRepository(User).findOne({
                where: {
                    confirmationToken: uuidToken,
                    id: userId,
                }
            })

            if (!user) {
                throw new BadRequest('This page does not exist')
            } else {
                user.confirmationToken = null
                user.confirmed = true
                return await getRepository(User).save(user)
            }
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async reset(email: string): Promise<Boolean> {
        if (!email) {
            throw new BadRequest('This user does not exist')
        }
        try {
            const user = await UserFacade.getByEmail(email)
            const token = uuid()
            user.resetToken = token
            user.resetTimeStamp = new Date()
            getRepository(User).save(user)
            console.log('send mail')
            sendMail(email, resetPassword(user.username, user.id, token))
            
            return true
        } catch (e) {
            throw new BadRequest(e)
        }

    }

    static async checkResetToken(userID: number, token: string): Promise<Boolean> {
        try {
            const user = await await getRepository(User).findOne({
                where: {
                    resetToken: token,
                    id: userID,
                }
            })

            if (!user) {
                throw new BadRequest('not exist')
            }
            const timeDifference = user.resetTimeStamp ? new Date().getTime() - user.resetTimeStamp.getTime() : 10000000
            if (timeDifference < 300000) { // 10 minutes
                return true
            } else {
                throw new NotFoundException('Page not found')
            }
        } catch (e) {
            throw new BadRequest(e)
        }
    }

    static async updatePassword(userID: number, token: string, newPassword: string): Promise<boolean> {
        try {
            const isGood = await UserFacade.checkResetToken(userID, token)
            if (isGood) {
                const user = await getRepository(User).findOne({
                    where: {
                        resetToken: token,
                        id: userID,
                    }
                })

                if (!user) {
                    throw new BadRequest('not exist')
                }
                console.log(user)
                user.resetToken = null
                user.resetTimeStamp = null
                user.password = Password.encrypt(newPassword)
                getRepository(User).save(user)
                return true
            } else {
                throw new BadRequest('This page does not exist')
            }
        } catch (e) {
            throw new BadRequest(e)
        }
    }
}
