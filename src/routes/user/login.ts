import * as jwt from 'jsonwebtoken'
import * as express from 'express'

import { UserFacade } from '../../bl/userFacade'
import { encryptionKey } from '../../config'

export class Login {
    static async authenticate(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.authenticate(req.body.email, req.body.password)
            const token = jwt.sign(
                { 
                    'userId': user.id,
                    'token': user.token
                }, 
                encryptionKey
            )
            res.status(200).json({ token })
        } catch (e) {
            res.status(401).json({ message: e.message })
        }
        res.end()
    }
}
