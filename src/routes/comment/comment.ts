import * as express from 'express'

import { isInteger } from '../../util'

import { CommentFacade } from '../../bl/commentFacade'
import { CardFacade } from '../../bl/cardFacade'

export class Comment {

    static async getAllFromCardId(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const comments = await CardFacade.getAllFromCardId(req.params.cardId)
                res.status(200).json(comments)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.cardId)) {
                const comment = await CommentFacade.insertFromCardId(req.requester, req.params.cardId, req.body)
                res.status(200).json(comment)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.commentId)) {
                const comment = await CommentFacade.update(req.params.commentId, req.body)
                res.status(200).json(comment)
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            if (isInteger(req.params.commentId)) {
                await CommentFacade.delete(req.params.commentId)
                res.status(204).end()
            } else {
                res.status(400).json({ error: 'Invalid request parameter' })
            }
        } catch (e) {
            res.status(400).json({ error: e.message})
        }
    }

}
