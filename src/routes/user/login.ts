import * as jwt from 'jsonwebtoken'
import * as express from 'express'

import { UserFacade } from '../../bl/userFacade'
import { encryptionKey } from '../../do_not_open_plz'

export class Login {
    static async authenticate(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.authenticate(req.params.email, req.params.password)
            res.writeHead(200, {'Content-Type': 'application/jwt'})
            const cookieToSet = jwt.sign({'user_id': user.id}, encryptionKey)
            res.cookie('photon', cookieToSet, { maxAge: 900000, httpOnly: true })
            res.end()
        } catch (e) {
            res.writeHead(401, e)
            res.end()
        }

    }
}
