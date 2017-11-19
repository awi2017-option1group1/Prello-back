import { RealTimeEvent } from '../realtimeFacade'

import { Card } from '../../entities/card'
import { List } from '../../entities/list'
import { Requester } from '../requester'

export const cardCreated = (requester: Requester, card: Card, list: List, boardId: number): RealTimeEvent => (
    {
        type: 'create-card',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            card,
            list,
            requester: requester.getUID()
        }
    }
)

export const cardUpdated = (requester: Requester, card: Card, list: List, boardId: number): RealTimeEvent => (
    {
        type: 'update-card',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            card,
            list,
            requester: requester.getUID()
        }
    }
)

export const cardDeleted = (requester: Requester, card: Card, boardId: number): RealTimeEvent => (
    {
        type: 'delete-card',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            card,
            requester: requester.getUID()
        }
    }
)
