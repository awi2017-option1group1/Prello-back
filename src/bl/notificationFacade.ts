import { getManager, getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Notification } from '../entities/notification'
import { User } from '../entities/user'
import { ParamsExtractor } from './paramsExtractor'

export class NotificationFacade {

    static async getAllFromUserId(userId: number): Promise<Notification[]> {
        return await getRepository(Notification)
            .createQueryBuilder('notification')
            .leftJoin('notification.user', 'user')
            .where('user.id = :userId', { userId })
            .orderBy({ 'notification.date': 'ASC' })
            .getMany()
    }

    static async deleteAllFromUserId(userId: number): Promise<void> {
        const notificationsToDelete = await NotificationFacade.getAllFromUserId(userId)
        let ids = notificationsToDelete.map(n => n.id)
        return await getRepository(Notification).removeByIds(ids)
    }

    static async getById(notificationId: number): Promise<Notification> {
        const notification = await getManager()
                            .getRepository(Notification)
                            .findOneById(notificationId)
        if (notification) {
            return notification
        } else {
            throw new NotFoundException('No Notification was found')
        }
    }

    static async delete(notificationId: number): Promise<void> {
        try {
            await getRepository(Notification).removeById(notificationId)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(notification: Notification): Promise<Notification> {
        try {
            let notificationToCreate = new Notification()
            notificationToCreate = ParamsExtractor.extract<Notification>(['about', 'from', 'type', 'user', 'date'],
                                                                         notification)
            return getManager().getRepository(Notification).save(notificationToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async createBoardUpdateNotifications(boardId: number, requesterId: number): Promise<void> {
        try {
            const users = await getRepository(User)
                .createQueryBuilder('user')
                .leftJoin('user.boards', 'board')
                .where('board.id = :boardId', { boardId })
                .getMany()
            users.forEach(async user => {
                if (user.notificationsEnabled) {
                    let notification = new Notification()
                    notification.type = 'board_updated'
                    notification.about = boardId
                    notification.from = requesterId
                    notification.user = user
                    notification.date = new Date()
                    await NotificationFacade.create(notification)
                }
            })
            return
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
