import * as express from 'express'

import { isInteger } from '../../util'

import { CheckListFacade } from '../../bl/checkListFacade'

export class CheckList {

    static async getAllFromCardId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const checkList = await CheckListFacade.getAllFromCardId(req.requester, req.params.cardId)
                res.status(200).json(checkList)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async insertFromCardId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const checkList = await CheckListFacade.insertFromCardId(req.requester, req.params.cardId, req.body)
                res.status(201).json(checkList)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.checklistId)) {
                const checkList = await CheckListFacade.update(req.requester, req.params.checklistId, req.body)
                res.status(200).json(checkList)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.checklistId)) {
                await CheckListFacade.delete(req.requester, req.params.checklistId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

}
