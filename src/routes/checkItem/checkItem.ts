import * as express from 'express'

import { isInteger } from '../../util'

import { CheckItemFacade } from '../../bl/checkItemFacade'

export class CheckItem {

    static async getAllFromChecklistId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.checklistId)) {
                const checkItems = await CheckItemFacade.getAllFromCheckListId(req.requester, req.params.checklistId)
                res.status(200).json(checkItems)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }

    static async insertFromChecklistId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.checklistId)) {
                const checkItem = await CheckItemFacade.insertFromChecklistId(
                    req.requester, 
                    req.params.checklistId, 
                    req.body
                )
                res.status(201).json(checkItem)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.checkitemId)) {
                const checkItem = await CheckItemFacade.update(req.requester, req.params.checkitemId, req.body)
                res.status(200).json(checkItem)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.checkitemId)) {
                await CheckItemFacade.delete(req.requester, req.params.checkitemId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
}
