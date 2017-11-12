import { getManager } from 'typeorm'
import { getRepository } from 'typeorm'

import { ParamsExtractor } from './paramsExtractorv2'

import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'

import { CheckItem } from '../entities/checkItem'
import { CheckListFacade } from './checkListFacade'
import { RealTimeFacade } from './realtimeFacade'
import { checkItemCreated, checkItemUpdated } from './realtime/realtimeCheckItem'

export class CheckItemFacade {

    static async getAllFromCheckListId(checkListId: number): Promise<CheckItem[]> {
        return await getRepository(CheckItem)
            .createQueryBuilder('checkItem')
            .leftJoin('checkItem.checkList', 'checkList')
            .where('checkList.id = :checkListId', { checkListId })
            .orderBy({ 'checkItem.pos': 'ASC' })
            .getMany()
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

    static async delete(checkItemId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(CheckItem)
                    .removeById(checkItemId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    // static async update(checkItemReceived: CheckItem, checkItemListId: number): Promise<void> {
    static async update(checkItemId: number, params: {}): Promise<CheckItem> {
        try {
            const extractor = new ParamsExtractor<CheckItem>(params).permit(['name', 'pos', 'state'])

            const checkItemToUpdate = await CheckItemFacade.getById(checkItemId, { relations: ['checkList'] })
            extractor.fill(checkItemToUpdate)

            const checkList = checkItemToUpdate.checkList

            const checkItem = await getRepository(CheckItem).save(checkItemToUpdate)
            delete checkItem.checkList

            RealTimeFacade.sendEvent(checkItemUpdated(checkItem, checkList.id))
            return checkItem
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async create(checkListId: number, params: {}): Promise<CheckItem> {
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

            const checkItem = await getRepository(CheckItem).save(checkItemToInsert)

            RealTimeFacade.sendEvent(checkItemCreated(checkItem, checkListId))
            return checkItem
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }
}
