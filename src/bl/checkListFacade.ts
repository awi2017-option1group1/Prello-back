import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { ParamsExtractor } from './paramsExtractorv2'
import { BadRequest } from './errors/BadRequest'

import { Requester } from './requester'
import { CheckList } from '../entities/checkList'
import { CardFacade } from './cardFacade'

import { RealTimeFacade } from './realtimeFacade'
import { checkListCreated, checkListUpdated, checkListDeleted } from './realtime/checkList'

export class CheckListFacade {

    static async getAllFromCardId(requester: Requester, cardId: number): Promise<CheckList[]> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        return await getRepository(CheckList)
            .createQueryBuilder('checkList')
            .leftJoin('checkList.card', 'card')
            .where('card.id = :cardId', { cardId })
            .orderBy({ 'checkList.pos': 'ASC' })
            .getMany()
    }

    static async getMaxPosForCardId(cardId: number): Promise<number> {
        const { max } = await getRepository(CheckList)
            .createQueryBuilder('checkList')
            .select('MAX(checkList.pos)', 'max')
            .leftJoin('checkList.card', 'card')
            .where('card.id = :cardId', { cardId })
            .getRawOne()
        return max
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

    static async insertFromCardId(requester: Requester, cardId: number, params: {}): Promise<CheckList> {
        try {
            (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

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
            delete checkList.card
            RealTimeFacade.sendEvent(checkListCreated(requester, checkListToInsert, cardId))
            
            return checkList
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(requester: Requester, checkListId: number, params: {}): Promise<CheckList> {
        try {
            const extractor = new ParamsExtractor<CheckList>(params).permit(['name', 'pos'])

            const listToUpdate = await CheckListFacade.getById(checkListId, { relations: ['card'] })
            extractor.fill(listToUpdate)

            const hasAccess = await requester.shouldHaveCardAccess(listToUpdate.card.id)
            hasAccess.orElseThrowError()

            const list = await getRepository(CheckList).save(listToUpdate)

            const card = list.card
            delete list.card
            RealTimeFacade.sendEvent(checkListUpdated(requester, list, card.id))
            
            return list
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(requester: Requester, checkListId: number): Promise<void> {
        try {
            const checkList = await CheckListFacade.getById(checkListId, { relations: ['card'] })
            const cardId = checkList.card.id

            const hasAccess = await requester.shouldHaveCardAccess(cardId)
            hasAccess.orElseThrowError()
            
            await getRepository(CheckList).removeById(checkListId)

            delete checkList.card
            RealTimeFacade.sendEvent(checkListDeleted(requester, checkList, cardId))

            return
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

}
