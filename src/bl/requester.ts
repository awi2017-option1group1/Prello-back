// import * as jwt from 'jsonwebtoken'
// import { getManager } from 'typeorm'

// import { User } from '../entities/user'
// import { encryptionKey } from '../config'

// class TokenContent {
//     userId: number
//     token: string // User session token
// }

// export interface Requester {

//     hasUID(userId: number): boolean

// }

// class EmptyRequester implements Requester {

//     hasUID(userId: number): boolean {
//         return false
//     }

// }

// class UserRequester implements Requester {

//     constructor(private user: User) {}

//     hasUID(userId: number): boolean {
//         return this.user.id === userId
//     }

// }

// export class RequesterFactory {

//     static empty = new EmptyRequester()

//     static async fromJWT(jwtToken: string): Promise<Requester> {
//         const jwtTokenContent = <TokenContent> jwt.verify(jwtToken, encryptionKey)
//         const user = await getManager().getRepository(User).findOne({
//             token: jwtTokenContent.token
//         })
//         if (user) {
//             return new UserRequester(user)
//         } else {
//             return RequesterFactory.empty
//         }
//     }

// }
