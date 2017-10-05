import * as jwt from 'jsonwebtoken'

import { getEntityManager } from 'typeorm'
import { User } from '../entities/user'
import { encryptionKey } from '../do_not_open_plz'

class TokenContent {
    userId: Number
}

export class Requester {

    static async fromJWT(token: string): Promise<Requester> {
        try {
            const tokenContent = <TokenContent> jwt.verify(token, encryptionKey)
            const user = await getEntityManager().getRepository(User).findOneById(tokenContent.userId)
            if (user) {
                return new Requester(user)
            } else {
                throw new UserNotFoundException('User was not found')
            }
        } catch (e) {
            console.log('Invalid token')
            return
        }
    }

    constructor(public user: User) {}

}
