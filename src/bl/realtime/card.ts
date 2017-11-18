import { RealTimeEvent } from '../realtimeFacade'

import { Card } from '../../entities/card'

export const cardCreated = (card: Card, boardId: number): RealTimeEvent => (
    {
        type: 'create-card',
        about: {
            object: 'board',
            id: boardId
        },
        payload: card
    }
)

export const cardUpdated = (card: Card, boardId: number): RealTimeEvent => (
    {
        type: 'update-card',
        about: {
            object: 'board',
            id: boardId
        },
        payload: card
    }
)

export const cardDeleted = (card: Card, boardId: number): RealTimeEvent => (
    {
        type: 'delete-card',
        about: {
            object: 'board',
            id: boardId
        },
        payload: card
    }
)
