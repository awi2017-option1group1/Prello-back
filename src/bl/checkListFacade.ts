import { getManager } from 'typeorm'
import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { CheckList } from '../entities/checkList'
// import { ParamsExtractor } from './paramsExtractor'
import { ParamsExtractor } from './paramsExtractorv2'
import { BadRequest } from './errors/BadRequest'
import { RealTimeFacade } from './realtimeFacade'
import { CheckListUpdated, checkListCreated } from './realtime/realtimeCheckList'
import { CardFacade } from './cardFacade'

export class CheckListFacade {

    static async getMaxPosForCardId(cardId: number): Promise<number> {
        const { max } = await getRepository(CheckList)
            .createQueryBuilder('checkList')
            .select('MAX(checkList.pos)', 'max')
            .leftJoin('checkList.card', 'card')
            .where('card.id = :cardId', { cardId })
            .getRawOne()
        return max
    }

    static async getAllFromCardId(cardId: number): Promise<CheckList[]> {
        const card = await CardFacade.getById(cardId)
        const checkLists = card.checkLists
        if (checkLists) {
            return checkLists
        } else {
            throw new NotFoundException('CheckList not found')
        }
    }

    static async getById(checkListId: number, options?: {}): Promise<CheckList> {
        const checkList = await getRepository(CheckList).findOne({
            ...options,
            where: {
                id: checkListId
            }
        })
        if (checkList) {
            return checkList
        } else {
            throw new NotFoundException('CheckList not found')
        }
    }

    static async delete(checkListId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(CheckList)
                    .removeById(checkListId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    /*
    static async update(checkListReceived: CheckList, checkListToUpdate: CheckList): Promise<void> {
        try {
            const checkListToSave = ParamsExtractor.extract<CheckList>(
                ['name', 'pos'], checkListReceived)
            const repository = getManager().getRepository(CheckList)
            return repository.updateById(checkListReceived.id, checkListToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }*/

    static async update(checkListId: number, params: {}): Promise<CheckList> {
        try {
            const extractor = new ParamsExtractor<CheckList>(params).permit(['name', 'pos'])

            const checkListToUpdate = await CheckListFacade.getById(checkListId)
            console.log(checkListToUpdate)

            extractor.fill(checkListToUpdate)

            const card = checkListToUpdate.card

            const checkList = await getRepository(CheckList).save(checkListToUpdate)
            console.log('OK 5')
            delete checkList.card

            RealTimeFacade.sendEvent(CheckListUpdated(checkList, card.id))
            return checkList
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async create(cardId: number, params: {}): Promise<CheckList> {
        try {
            const extractor = new ParamsExtractor<CheckList>(params).permit(['name', 'pos'])
            const checkListToInsert = extractor.fill(new CheckList())

            if (!extractor.hasParam('name')) {
                checkListToInsert.name = 'EmptyName'
            }

            if (!extractor.hasParam('pos')) {
                const maxPos = await CheckListFacade.getMaxPosForCardId(cardId)
                checkListToInsert.pos = maxPos + 1
            }

            checkListToInsert.card = await CardFacade.getById(cardId)

            const checkList = await getRepository(CheckList).save(checkListToInsert)

            RealTimeFacade.sendEvent(checkListCreated(checkList, cardId))
            return checkList
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }
}
