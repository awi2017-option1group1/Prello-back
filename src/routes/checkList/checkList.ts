import * as express from 'express'
import { isInteger } from '../../util'

import { CheckListFacade } from '../../bl/checkListFacade'
import { CheckItemFacade } from '../../bl/checkItemFacade'

export class CheckList {

    static async getAllFromCardId(req: express.Request, res: express.Response) {
        try {
            const checkList = await CheckListFacade.getAllFromCardId(req.params.id)
            res.status(200).json(checkList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const checkList = await CheckListFacade.getById(req.params.id)
            // req.params.id is the id of the TaskList
            res.status(200).json(checkList)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getAllCheckItems(req: express.Request, res: express.Response) {
        try {
            const checkItems = await CheckItemFacade.getAllFromCheckListId(req.params.id)
            // req.params.id is the id of the CheckList
            res.status(200).json(checkItems)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.id)) {
                await CheckListFacade.delete(req.params.id)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const checkList = await CheckListFacade.update(req.params.id, req.body)
            res.status(200).json(checkList)
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async createCheckItem(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.id)) {
                const checkItem = await CheckItemFacade.create(req.params.id, req.body)
                res.status(201).json(checkItem)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }
}
