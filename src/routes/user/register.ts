import * as express from 'express'
import * as uuid from 'uuid/v5'
import { UserFacade } from '../../bl/userFacade'

export class Register {
    static async register(req: express.Request, res: express.Response) {
        try {
            const d = uuid('photon.igpolytech.fr', uuid.DNS)
            console.log('-------------')
            console.log(d)
            const user = await UserFacade.register( req.body.email, 
                                                    req.body.username, 
                                                    d, 
                                                    req.body.password)
            res.status(200).json(user)
        } catch (e) {
            if (e.errors) {
                res.status(400).json({ errors: e.errors })
            } else {
                console.log(e)
                res.status(400).json({ errors: [{ message: 'Unexpected error' }] })
            }
        }
        res.end()
    }
}
