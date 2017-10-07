import * as jwt from 'jsonwebtoken'
import * as express from 'express'

import { UserFacade } from '../../bl/userFacade'
import { encryptionKey } from '../../config'

export class Login {
    static async authenticate(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.authenticate(req.body.email, req.body.password)

            const cookieToSet = jwt.sign({'user_id': user.id}, encryptionKey)
            res.cookie('photon', cookieToSet, { maxAge: 900000, httpOnly: true, secure: true })

            res.status(200).json(user)
        } catch (e) {
            res.status(401).json({ message: e.message })
        }
        res.end()
    }
}
