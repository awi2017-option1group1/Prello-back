import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Notification } from '../entities/notification'
import { User } from '../entities/user'
import { ParamsExtractor } from './paramsExtractorv2'
import { Requester } from './requester'
import { BoardFacade } from './boardFacade'

import { RealTimeFacade } from './realtimeFacade'
import { notificationAdded, notificationDeleted } from './realtime/notifications'

export class NotificationFacade {

    static async getAllFromUserId(userId: number): Promise<Notification[]> {
        return await getRepository(Notification)
            .createQueryBuilder('notification')
            .leftJoin('notification.user', 'user')
            .where('user.id = :userId', { userId })
            .orderBy({ 'notification.date': 'ASC' })
            .getMany()
    }

    static async deleteAllFromUserId(requester: Requester, userId: number): Promise<void> {
        requester.shouldHaveUid(userId).orElseThrowError()

        const notificationsToDelete = await NotificationFacade.getAllFromUserId(userId)

        let ids = notificationsToDelete.map(n => n.id)
        await getRepository(Notification).removeByIds(ids)

        RealTimeFacade.sendEvent(notificationDeleted(userId))

        return
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

            const notification =  await getRepository(Notification).save(notificationToCreate)

            RealTimeFacade.sendEvent(notificationAdded(notification.from, notification, notification.user.id))

            return notification
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

    static async createCardUpdateNotifications(requester: Requester, cardId: number, boardId: number): Promise<void> {
        try {
            let users = await getRepository(User)
                .createQueryBuilder('user')
                .leftJoin('user.cards', 'card')
                .where('card.id = :cardId', { cardId })
                .getMany()

            users.forEach(async user => {
                if (user.notificationsEnabled && user.id !== requester.getUID()) {
                    let notification = new Notification()
                    notification.type = 'card_list_updated'
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

    static async createAssigneduserNotifications(requester: Requester, userId: number,
                                                 cardId: number, boardId: number): Promise<void> {
        try {
            let user = await getRepository(User).findOneById(userId)
            if (user && user.notificationsEnabled && user.id !== requester.getUID()) {
                let notification = new Notification()
                notification.type = 'card_user_assigned'
                notification.about = boardId
                notification.from = requester.getUID()
                notification.user = user
                notification.date = new Date()
                await NotificationFacade.create(notification)
            }
            return
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
