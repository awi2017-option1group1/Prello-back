import * as express from 'express'

import { CommentFacade } from '../../bl/commentFacade'

export class Comment {

    static async getAllFromCardId(req: express.Request, res: express.Response) {
        try {
            const comments = await CommentFacade.getAllFromCardId(req.params.card_id)
            res.status(200).json(comments)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    /*
    static async getAllFromUserId(req: express.Request, res: express.Response) {
        try {
            const comments = await CommentFacade.getAllFromUserId(req.params.user_id)
            res.status(200).json(comments)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }*/

    /*
   static async getOneById(req: express.Request, res: express.Response) {
        try {
            const comment = await CommentFacade.getById(req.params.comment_id)
            res.status(200).json(comment)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }*/

    static async delete(req: express.Request, res: express.Response) {
        try {
            const deletionSuccess = await CommentFacade.delete(req.params.comment_id)
            if (deletionSuccess) {
                res.status(200).json(deletionSuccess)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    /*
    static async update(req: express.Request, res: express.Response) {
        try {
            const comment = CommentFacade.update(req.body)
            res.status(200).json(comment)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }*/

    static async create(req: express.Request, res: express.Response) {
        try {
            const comment = await CommentFacade.create(req.body, req.params.card_id)
            res.status(200).json(comment)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }
}
