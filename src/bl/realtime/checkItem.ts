import { RealTimeEvent } from '../realtimeFacade'

import { CheckItem } from '../../entities/checkItem'

export const checkItemCreated = (checkItem: CheckItem, cardId: number): RealTimeEvent => (
    {
        type: 'create-checkItem',
        about: {
            object: 'card',
            id: cardId
        },
        payload: checkItem
    }
)

export const checkItemUpdated = (checkItem: CheckItem, cardId: number): RealTimeEvent => (
    {
        type: 'update-checkItem',
        about: {
            object: 'card',
            id: cardId
        },
        payload: checkItem
    }
)

export const checkItemDeleted = (checkItem: CheckItem, cardId: number): RealTimeEvent => (
    {
        type: 'delete-checkItem',
        about: {
            object: 'card',
            id: cardId
        },
        payload: checkItem
    }
)
