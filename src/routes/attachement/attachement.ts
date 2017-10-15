import * as express from 'express'

import { AttachementFacade } from '../../bl/attachementFacade'

export class Attachement {

    static async getAllFromCardId(req: express.Request, res: express.Response) {
        try {
            const attachement = await AttachementFacade.getAllFromCardId(req.params.card_id)
            res.status(200).json(attachement)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const attachement = await AttachementFacade.getById(req.params.attachement_id)
            res.status(200).json(attachement)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const deletionSuccess = await AttachementFacade.delete(req.params.attachement_id)
            if (deletionSuccess) {
                res.status(200).json(deletionSuccess)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const attachement = await AttachementFacade.create(req.body, req.params.attachement_id)
            res.status(200).json(attachement)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
}
