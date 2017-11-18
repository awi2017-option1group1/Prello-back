import * as express from 'express'

import { UserFacade } from '../../bl/userFacade'

export class User {
    static async getAll(req: express.Request, res: express.Response) {
        try {
            const users = await UserFacade.getAll()
            res.status(200).json(users)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.getById(req.requester, req.params.user_id)
            res.status(200).json(user)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            await UserFacade.delete(req.requester, req.params.user_id)
            res.status(204).end()
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.update(req.requester, req.params.userId, req.body)
            res.status(200).json(user)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async confirm(req: express.Request, res: express.Response) {
        try {
            const confirmed = await UserFacade.confirm(req.params.userId, req.params.confirmationToken)
            res.status(200).json(confirmed)
        } catch (e) {
            res.status(404).json({ message: e.message.message})
        }
        
    }

    static async search(req: express.Request, res: express.Response) {
        try {
            const results = await UserFacade.search(req.params.userID, req.params.value)
            res.status(200).json(results)
        } catch (e) {
            res.status(404).json({message: e.message})
        }
    }

    static async reset(req: express.Request, res: express.Response) {
        try {
            const email = req.body.email
            const user = await UserFacade.reset(email)
            res.status(200).json(user)
        } catch (e) {
            res.status(404).json({message: e.message.message})
        }
    }

    static async checkResetToken(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.checkResetToken(req.params.userID, req.params.token)
            res.status(203).json(user)
        } catch (e) {
            res.status(404).json({message: e.message.message})
        }
    }

    static async updatePassword(req: express.Request, res: express.Response) {
        try {
            const updatedUser = await UserFacade.updatePassword(req.params.userID, req.params.token, req.body.password)
            res.status(200).json(updatedUser)
        } catch (e) {
            res.status(404).json({message: e.message.message})
        }
    }
}
