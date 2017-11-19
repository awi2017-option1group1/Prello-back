import { RealTimeEvent } from '../realtimeFacade'

import { Notification } from '../../entities/notification'

export const notificationAdded = (requesterId: number, notification: Notification, userId: number): RealTimeEvent => (
    {
        type: 'add-notification',
        about: {
            object: 'user',
            id: userId
        },
        payload: {
            notification,
            requester: requesterId
        }
    }
)

export const notificationDeleted = (userId: number): RealTimeEvent => (
    {
        type: 'delete-notifications',
        about: {
            object: 'user',
            id: userId
        },
        payload: {
            requester: userId
        }
    }
)
