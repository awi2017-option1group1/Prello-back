
import { RealTimeEvent } from '../realtimeFacade'

import { CheckItem } from '../../entities/checkItem'
import { CheckList } from '../../entities/checkList'
import { Requester } from '../requester'

export const checkItemCreated = (requester: Requester, checkItem: CheckItem, checkList: CheckList, cardId: number): 
RealTimeEvent => (
    {
        type: 'create-checkItem',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            checkItem,
            checkList,
            requester: requester.getUID()
        }
    }
)

export const checkItemUpdated = (requester: Requester, checkItem: CheckItem, checkList: CheckList, cardId: number): 
RealTimeEvent => (
    {
        type: 'update-checkItem',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            checkItem,
            checkList,
            requester: requester.getUID()
        }
    }
)

export const checkItemDeleted = (requester: Requester, checkItem: CheckItem, checkList: CheckList, cardId: number): 
RealTimeEvent => (
    {
        type: 'delete-checkItem',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            checkItem,
            checkList,
            requester: requester.getUID()
        }
    }
)
