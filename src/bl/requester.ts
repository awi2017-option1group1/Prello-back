import * as jwt from 'jsonwebtoken'

import {getEntityManager} from 'typeorm'
import {User} from '../entities/user'

class TokenContent {
    userId: Number
}

export class Requester {

    static async fromJWT(token: string): Promise<Requester> {
        const tokenContent = jwt.verify(token, 'secret')
        if (tokenContent instanceof TokenContent  && tokenContent.hasOwnProperty('userId')) {
            const user = await getEntityManager().getRepository(User).findOneById(tokenContent.userId)
            if (user) {
                return new Requester(user)
            } else {
                throw new UserNotFoundException('User was not found')
            }
        } else {
            throw new UserNotFoundException('User was not found')
        }

    }

    constructor(public user: User) {}

}
