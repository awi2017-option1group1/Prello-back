import { CardFacade } from './cardFacade'
import * as rq from 'request'
import { getRepository } from 'typeorm'

import { config } from '../config'
import { fullUrlFromString, AUTH_HOST } from '../url'

import { User } from '../entities/user'
import { BoardFacade } from './boardFacade'
import { ListFacade } from './listFacade'

export class AuthCondition {
    constructor(public condition: boolean) {}

    orElseThrowError() {
        if (!this.condition) {
            throw new Error('Not Authorized!')
        }
    }

    toBoolean() {
        return this.condition
    }
}

export interface Requester {

    getUID(): number
    isEmptyRequester(): boolean
    hasUID(userId: number): boolean

    shouldHaveUid(userId: number): AuthCondition
    shouldHaveBoardAccess(boardId: number): Promise<AuthCondition>
    shouldHaveListAccess(listId: number): Promise<AuthCondition>
    shouldHaveCardAccess(cardId: number): Promise<AuthCondition>

}

class EmptyRequester implements Requester {

    getUID(): number {
        throw new Error('EmptyRequester do not have user id')
    }

    isEmptyRequester(): boolean {
        return true
    }

    hasUID(userId: number): boolean {
        return false
    }

    shouldHaveUid(userId: number): AuthCondition {
        return new AuthCondition(false)
    }

    shouldHaveBoardAccess(boardId: number): Promise<AuthCondition> {
        return Promise.resolve(new AuthCondition(false))
    }

    shouldHaveListAccess(listId: number): Promise<AuthCondition> {
        return Promise.resolve(new AuthCondition(false))
    }

    shouldHaveCardAccess(cardId: number): Promise<AuthCondition> {
        return Promise.resolve(new AuthCondition(false))
    }

}

class UserRequester implements Requester {

    constructor(private user: User) {}

    getUID(): number {
        return this.user.id
    }

    isEmptyRequester(): boolean {
        return false
    }

    hasUID(userId: number): boolean {
        return this.user.id === userId
    }

    shouldHaveUid(userId: number): AuthCondition {
        return new AuthCondition(this.hasUID(userId))
    }

    async shouldHaveBoardAccess(boardId: number): Promise<AuthCondition> {
        const hasAccess = await BoardFacade.hasAccess(this.getUID(), boardId)
        return new AuthCondition(hasAccess)
    }

    async shouldHaveListAccess(listId: number): Promise<AuthCondition> {
        const list =  await ListFacade.getById(listId, { relations: ['board'] })
        const hasAccess = await BoardFacade.hasAccess(this.getUID(), list.board.id)
        return new AuthCondition(hasAccess)
    }

    async shouldHaveCardAccess(cardId: number): Promise<AuthCondition> {
        const card = await CardFacade.getByIdWithBoard(cardId)
        const hasAccess = await BoardFacade.hasAccess(this.getUID(), card.list.board.id)
        return new AuthCondition(hasAccess)
    }

}

export class RequesterToken {
    token: string
    type: 'header' | 'cookie'
}

export class TokenData {
    user: {
        uid: number
    }
}

export class RequesterFactory {

    static empty = new EmptyRequester()

    static async fromToken(token: RequesterToken): Promise<Requester> {
        try {
            const tokenData = await RequesterFactory.retrieveTokenData(token)
            return RequesterFactory.fromUid(tokenData.user.uid)          
        } catch (e) {
            console.error(e)
            return RequesterFactory.empty
        }
    }

    static async fromUid(uid: number): Promise<Requester> {
        try {
            const user = await getRepository(User).findOneById(uid)
            if (user) {
                return new UserRequester(user)
            } else {
                return RequesterFactory.empty
            }           
        } catch (e) {
            console.error(e)
            return RequesterFactory.empty
        }
    }

    private static async retrieveTokenData(token: RequesterToken): Promise<TokenData> {
        return new Promise<TokenData>((resolve, reject) => {
            rq.get(
                fullUrlFromString(`/data/token/${token.token}/${token.type}`, AUTH_HOST), 
                {
                    json: true,
                    auth: {
                        bearer: config.internalToken
                    }
                },
                (reqErr, response, body) => {
                    if (reqErr) {
                        reject(reqErr)
                    } else {
                        if (response.statusCode! % 100 === 4) {
                            reject(body)
                        }
                        resolve(body)
                    }
                }
            )
        }) 
    }

}
