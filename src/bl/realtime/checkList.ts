import { RealTimeEvent } from '../realtimeFacade'

import { CheckList } from '../../entities/checkList'
import { Requester } from '../requester'

export const checkListCreated = (requester: Requester, checkList: CheckList, cardId: number): RealTimeEvent => (
    {
        type: 'create-checkList',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            checkList,
            requester: requester.getUID()
        }
    }
)

export const checkListUpdated = (requester: Requester, checkList: CheckList, cardId: number): RealTimeEvent => (
    {
        type: 'update-checkList',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            checkList,
            requester: requester.getUID()
        }
    }
)

export const checkListDeleted = (requester: Requester, checkList: CheckList, cardId: number): RealTimeEvent => (
    {
        type: 'delete-checkList',
        about: {
            object: 'card',
            id: cardId
        },
        payload: {
            checkList,
            requester: requester.getUID()
        }
    }
)
