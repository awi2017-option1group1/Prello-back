import { getRepository } from 'typeorm'

import { ParamsExtractor } from './paramsExtractorv2'

import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'

import { Requester } from './requester'
import { CheckItem } from '../entities/checkItem'
import { CheckListFacade } from './checkListFacade'

export class CheckItemFacade {

    static async getAllFromCheckListId(requester: Requester, checkListId: number): Promise<CheckItem[]> {
        return await getRepository(CheckItem)
            .createQueryBuilder('checkItem')
            .leftJoin('checkItem.checkList', 'checkList')
            .where('checkList.id = :checkListId', { checkListId })
            .orderBy({ 'checkItem.pos': 'ASC' })
            .getMany()
    }

    static async getByIdWithCard(checkItemId: number): Promise<CheckItem> {
        const checkItem = await getRepository(CheckItem)
            .createQueryBuilder('checkItem')
            .leftJoinAndSelect('checkItem.checkList', 'checkList')
            .leftJoinAndSelect('checkList.card', 'card')
            .where('checkItem.id = :checkItemId', { checkItemId })
            .getOne()
        if (checkItem) {
            return checkItem
        } else {
            throw new NotFoundException('CheckList not found')
        }
    }

    static async getMaxPosForCheckListId(checkListId: number): Promise<number> {
        const { max } = await getRepository(CheckItem)
            .createQueryBuilder('checkItem')
            .select('MAX(checkItem.pos)', 'max')
            .leftJoin('checkItem.checkList', 'checkList')
            .where('checkList.id = :checkListId', { checkListId })
            .getRawOne()
        return max
    }

    static async getById(checkItemId: number, options?: {}): Promise<CheckItem> {
        const checkItem = await getRepository(CheckItem).findOne({
            ...options,
            where: {
                id: checkItemId
            }
        })
        if (checkItem) {
            return checkItem
        } else {
            throw new NotFoundException('CheckList not found')
        }
    }

    static async insertFromChecklistId(requester: Requester, checkListId: number, params: {}): Promise<CheckItem> {
        try {
            const extractor = new ParamsExtractor<CheckItem>(params).permit(['name', 'pos', 'state'])
            const checkItemToInsert = extractor.fill(new CheckItem())

            if (!extractor.hasParam('name')) {
                checkItemToInsert.name = 'EmptyName'
            }

            if (!extractor.hasParam('pos')) {
                const maxPos = await CheckItemFacade.getMaxPosForCheckListId(checkListId)
                checkItemToInsert.pos = maxPos + 1
            }

            if (!extractor.hasParam('state')) {
                checkItemToInsert.state = false
            }

            checkItemToInsert.checkList = await CheckListFacade.getById(checkListId)

            // RealTimeFacade.sendEvent(checkItemCreated(checkItem, checkListId))

            const checkItem = await getRepository(CheckItem).save(checkItemToInsert)
            delete checkItem.checkList
            return checkItem
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(requester: Requester, checkItemId: number, params: {}): Promise<CheckItem> {
        try {
            const extractor = new ParamsExtractor<CheckItem>(params).permit(['name', 'pos', 'state'])

            const checkItemToUpdate = await CheckItemFacade.getByIdWithCard(checkItemId)
            extractor.fill(checkItemToUpdate)

            const hasAccess = await requester.shouldHaveCardAccess(checkItemToUpdate.checkList.card.id)
            hasAccess.orElseThrowError()

            // const checkList = checkItemToUpdate.checkList
            delete checkItemToUpdate.checkList
            // RealTimeFacade.sendEvent(checkItemUpdated(checkItem, checkList.id))
            
            const checkItem = await getRepository(CheckItem).save(checkItemToUpdate)
            return checkItem
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(requester: Requester, checkItemId: number): Promise<void> {
        try {
            const checkItemToDelete = await CheckItemFacade.getByIdWithCard(checkItemId)

            const hasAccess = await requester.shouldHaveCardAccess(checkItemToDelete.checkList.card.id)
            hasAccess.orElseThrowError()

            await getRepository(CheckItem).removeById(checkItemId)
            return
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }
}
