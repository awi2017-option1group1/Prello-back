import * as express from 'express'

import { NotificationFacade } from '../../bl/notificationFacade'

export class Notification {

    static async getAllFromUserId(req: express.Request, res: express.Response) {
        try {
            const notifications = await NotificationFacade.getAllFromUserId(req.params.user_id)
            res.status(200).json(notifications)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async getById(req: express.Request, res: express.Response) {
        try {
            const notification = await NotificationFacade.getById(req.params.notification_id)
            res.status(200).json(notification)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async delete(req: express.Request, res: express.Response) {
        try {
            const notification = await NotificationFacade.delete(req.params.notification_id)
            if (notification) {
                res.status(200).json(notification)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

    static async create(req: express.Request, res: express.Response) {
        try {
            const notification = await NotificationFacade.create(req.body)
            res.status(200).json(notification)
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }}
