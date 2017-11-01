import * as rq from 'request'

import { config } from '../config'
import { fullUrlFromString, AUTH_HOST } from '../url'

import { UserFacade } from './userFacade'
import { User } from '../entities/user'

export interface Requester {

    hasUID(userId: number): boolean
    hasTID(teamId: number): boolean

}

class EmptyRequester implements Requester {

    hasUID(userId: number): boolean {
        return false
    }

    hasTID(teamId: number): boolean {
        return false
    }

}

class UserRequester implements Requester {

    constructor(private user: User) {}

    hasUID(userId: number): boolean {
        return this.user.id === userId
    }

    hasTID(teamId: number): boolean {
        return false
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
            const user = await UserFacade.getById(tokenData.user.uid)
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
