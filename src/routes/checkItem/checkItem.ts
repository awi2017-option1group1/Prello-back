import * as express from 'express'

import { CheckItemFacade } from '../../bl/checkItemFacade'

export class CheckItem {

    static async getAllFromCheckListId(req: express.Request, res: express.Response) {
        try {
            const checkItems = await CheckItemFacade.getAllFromCheckListId(req.params.id)
            // req.params.id is the id of the CheckList
            res.status(200).json(checkItems)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const checkItem = await CheckItemFacade.getById(req.params.id)
            // req.params.id is the id of the CheckItem
            res.status(200).json(checkItem)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const deletionSuccess = await CheckItemFacade.delete(req.params.id)
            // req.params.id is the id of the CheckItem
            if (deletionSuccess) {
                res.status(200).json(deletionSuccess)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const checkItem = await CheckItemFacade.update(req.body, req.params.id)
            // req.params.id is the id of the CheckItem, req.body contains the new checkItem
            res.status(200).json(checkItem)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const checkItem = await CheckItemFacade.create(req.body, req.params.id)
            // req.params.id is the id of the CheckItem
            res.status(200).json(checkItem)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
}
