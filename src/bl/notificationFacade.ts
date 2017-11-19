import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Notification } from '../entities/notification'
import { User } from '../entities/user'
import { ParamsExtractor } from './paramsExtractorv2'
import { BoardFacade } from './boardFacade'
import { Requester } from './requester'

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
        const notification = await getRepository(Notification)
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

    static async create(params: {}): Promise<Notification> {
        try {
            const extractor = new ParamsExtractor<Notification>(params)
                .permit(['about', 'from', 'type', 'user', 'date'])
            const notificationToCreate = extractor.fill(new Notification())
            return await getRepository(Notification).save(notificationToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async createBoardUpdateNotifications(requester: Requester, boardId: number): Promise<void> {
        try {
            let users = await getRepository(User)
                .createQueryBuilder('user')
                .leftJoin('user.boards', 'board')
                .where('board.id = :boardId', { boardId })
                .getMany()
            const board = await BoardFacade.getById(requester, boardId, {relations: ['owner']})
            users = users.concat(board.owner)

            users.forEach(async user => {
                if (user.notificationsEnabled && user.id !== requester.getUID()) {
                    let notification = new Notification()
                    notification.type = 'board_updated'
                    notification.about = boardId
                    notification.from = requester.getUID()
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
