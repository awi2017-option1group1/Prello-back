import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { ParamsExtractor } from './paramsExtractorv2'
import { BadRequest } from './errors/BadRequest'

import { CheckList } from '../entities/checkList'
import { CardFacade } from './cardFacade'

export class CheckListFacade {

    static async getAllFromCardId(cardId: number): Promise<CheckList[]> {
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

    static async insertFromCardId(cardId: number, params: {}): Promise<CheckList> {
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

            // RealTimeFacade.sendEvent(checkListCreated(checkList, cardId))
            
            const checkList = await getRepository(CheckList).save(checkListToInsert)
            delete checkList.card
            return checkList
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(checkListId: number, params: {}): Promise<CheckList> {
        try {
            const extractor = new ParamsExtractor<CheckList>(params).permit(['name', 'pos'])

            const listToUpdate = await CheckListFacade.getById(checkListId, { relations: ['card'] })
            extractor.fill(listToUpdate)

            // const card = listToUpdate.card
            delete listToUpdate.card
            // RealTimeFacade.sendEvent(checkListUpdated(list, card.id))
            
            const list = await getRepository(CheckList).save(listToUpdate)
            return list
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(checkListId: number): Promise<void> {
        try {
            // const checkList = await CheckListFacade.getById(checkListId, { relations: ['card'] })
            // const cardId = checkList.card.id
            // delete checkList.card
            // RealTimeFacade.sendEvent(checkListDeleted(checkList, cardId))

            await getRepository(CheckList).removeById(checkListId)

            return
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

}
