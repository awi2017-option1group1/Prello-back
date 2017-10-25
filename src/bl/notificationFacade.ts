import { getEntityManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Notification } from '../entities/notification'
import { ParamsExtractor } from './paramsExtractor'

export class NotificationFacade {

    static async getAllFromUserId(userId: number): Promise<Notification[]> {
        const notifications = await getEntityManager()
                            .getRepository(Notification)
                            .find({
                                    user: userId
                            })
        if (notifications) {
            return notifications
        } else {
            throw new NotFoundException('No Notification was found')
        }
    }

    static async getById(notificationId: number): Promise<Notification> {
        const notification = await getEntityManager()
                            .getRepository(Notification)
                            .findOneById(notificationId)
        if (notification) {
            return notification
        } else {
            throw new NotFoundException('No Notification was found')
        }
    }

    static async delete(notificationId: number): Promise<boolean> {
        try {
            const notificationToDelete = await NotificationFacade.getById(notificationId)
            const deletedBoard = await getEntityManager()
                    .getRepository(Notification)
                    .remove(notificationToDelete)
            if (deletedBoard) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(notification: Notification): Promise<Notification> {
        try {
            let notificationToCreate = new Notification()
            notificationToCreate = ParamsExtractor.extract<Notification>(['about', 'from', 'type', 'user'],
                                                                         notification, notificationToCreate)
            return getEntityManager().getRepository(Notification).persist(notificationToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
