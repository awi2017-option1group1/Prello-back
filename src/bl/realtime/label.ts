import { RealTimeEvent } from '../realtimeFacade'

import { Card } from '../../entities/card'
import { Tag } from '../../entities/tag'

export const tagCreated = (tag: Tag, boardId: number): RealTimeEvent => (
    {
        type: 'create-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: tag
    }
)

export const tagUpdated = (tag: Tag, boardId: number): RealTimeEvent => (
    {
        type: 'update-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: tag
    }
)

export const tagDeleted = (tag: Tag, boardId: number): RealTimeEvent => (
    {
        type: 'delete-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: tag
    }
)

export const tagAssigned = (tag: Tag, card: Card, boardId: number): RealTimeEvent => (
    {
        type: 'assign-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            tag,
            card
        }
    }
)

export const tagUnassigned = (tag: Tag, card: Card, boardId: number): RealTimeEvent => (
    {
        type: 'unassign-label',
        about: {
            object: 'board',
            id: boardId
        },
        payload: {
            tag,
            card
        }
    }
)
