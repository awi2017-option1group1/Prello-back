import * as jwt from 'jsonwebtoken'
import { getEntityManager } from 'typeorm'

import { UserNotFoundException } from './errors/UserNotFoundException'
import { User } from '../entities/user'
import { encryptionKey } from '../config'

class TokenContent {
    userId: Number
}

export class Requester {

    static async fromJWT(token: string): Promise<Requester> {
        const tokenContent = <TokenContent> jwt.verify(token, encryptionKey)
        const user = await getEntityManager().getRepository(User).findOneById(tokenContent.userId)
        if (user) {
            return new Requester(user)
        } else {
            throw new UserNotFoundException('User was not found')
        }
    }

    constructor(public user: User) {}
}
