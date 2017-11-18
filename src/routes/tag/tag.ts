import * as express from 'express'

import { isInteger } from '../../util'

import { TagFacade } from '../../bl/tagFacade'

export class Tag {
    static async getAllFromBoardId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.boardId)) {
                const tags = await TagFacade.getAllFromBoardId(req.requester, req.params.boardId)
                res.status(200).json(tags)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async insertFromBoardId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.boardId)) {
                const tag = await TagFacade.create(req.requester, req.params.boardId, req.body)
                res.status(201).json(tag)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.labelId)) {
                const tag = await TagFacade.update(req.requester, req.params.labelId, req.body)
                res.status(200).json(tag)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.labelId)) {
                await TagFacade.delete(req.requester, req.params.labelId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message})
        }
    }
}
