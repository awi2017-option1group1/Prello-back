import { RealTimeEvent } from '../realtimeFacade'

import { CheckList } from '../../entities/checkList'

export const checkListCreated = (checkList: CheckList, cardId: number): RealTimeEvent => (
    {
        type: 'create-checkList',
        about: {
            object: 'card',
            id: cardId
        },
        payload: checkList
    }
)

export const CheckListUpdated = (checkList: CheckList, cardId: number): RealTimeEvent => (
    {
        type: 'update-checkList',
        about: {
            object: 'card',
            id: cardId
        },
        payload: checkList
    }
)
