import * as express from 'express'

import { UserFacade } from '../../bl/userFacade'

export class User {
    static async getAll(req: express.Request, res: express.Response) {
        try {
            const users = await UserFacade.getAll()
            res.status(200).json(users)
        } catch (e) {
            console.error(e)
            res.status(404).json({ message: e.message})
        }
    }

    static async getAllFromTeamId(req: express.Request, res: express.Response) {
        try {
            const users = await UserFacade.getAllFromTeamId(req.params.list_id)
            res.status(200).json(users)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getOneById(req: express.Request, res: express.Response) {
        try {
            const board = await UserFacade.getById(req.params.user_id)
            res.status(200).json(board)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.delete(req.params.user_id)
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async update(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.update(req.params.userId, req.body)
            res.status(200).json(user)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async confirm(req: express.Request, res: express.Response) {
        try {
            const user = await UserFacade.getById(req.params.userId)
            if (user.confirmationToken === req.params.confirmationToken) {
                const confirmed = await UserFacade.confirm(req.params.userId, req.params.confirmationToken)
                res.status(200).json(confirmed)
            } else {
                res.status(404).json({ message: 'This page does not exist'})
            }
            
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
        
    }

}
