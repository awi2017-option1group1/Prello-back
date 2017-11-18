import { RealTimeEvent } from '../realtimeFacade'

import { CheckItem } from '../../entities/checkItem'

export const checkItemCreated = (checkItem: CheckItem, checkListId: number): RealTimeEvent => (
    {
        type: 'create-checkItem',
        about: {
            object: 'checkList',
            id: checkListId
        },
        payload: checkItem
    }
)

export const checkItemUpdated = (checkItem: CheckItem, checkListId: number): RealTimeEvent => (
    {
        type: 'update-checkItem',
        about: {
            object: 'checkList',
            id: checkListId
        },
        payload: checkItem
    }
)

export const checkItemDeleted = (checkItem: CheckItem, checkListId: number): RealTimeEvent => (
    {
        type: 'delete-checkItem',
        about: {
            object: 'checkList',
            id: checkListId
        },
        payload: checkItem
    }
)
