import * as express from 'express'

import { isInteger } from '../../util'

import { ListFacade } from '../../bl/listFacade'

export class List {
    static async getAllFromBoardId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.boardId)) {
                const lists = await ListFacade.getAllFromBoardId(req.params.boardId)
                res.status(200).json(lists)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async insertFromBoardId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.boardId)) {
                const list = await ListFacade.insertFromBoardId(req.params.boardId, req.body)
                res.status(201).json(list)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.listId)) {
                const list = await ListFacade.update(req.params.listId, req.body)
                res.status(200).json(list)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.listId)) {
                ListFacade.delete(req.params.listId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(404).json({ error: e.message})
        }
    }
}
