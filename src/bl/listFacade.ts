import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'
import { ParamsExtractor } from './paramsExtractorv2'

import { Requester } from './requester'
import { Board } from '../entities/board'
import { List } from '../entities/list'

import { RealTimeFacade } from './realtimeFacade'
import { listCreated, listUpdated, listDeleted } from './realtime/realtimeList'

export class ListFacade {

    static async getAllFromBoardId(requester: Requester, boardId: number): Promise<List[]> {
        (await requester.shouldHaveBoardAccess(boardId)).orElseThrowError()

        return await getRepository(List)
            .createQueryBuilder('list')
            .leftJoin('list.board', 'board')
            .where('board.id = :boardId', { boardId })
            .orderBy({ 'list.pos': 'ASC' })
            .getMany()
    }

    static async getMaxPosForBoardId(boardId: number): Promise<number> {
        const { max } = await getRepository(List)
            .createQueryBuilder('list')
            .select('MAX(list.pos)', 'max')
            .leftJoin('list.board', 'board')
            .where('board.id = :boardId', { boardId })
            .getRawOne()
        return max
    }

    static async getById(listId: number, options?: {}): Promise<List> {
        const list = await getRepository(List).findOne({
            ...options,
            where: {
                id: listId
            }
        })
        if (list) {
            return list
        } else {
            throw new NotFoundException('List not found')
        }
    }

    static async insertFromBoardId(requester: Requester, boardId: number, params: {}): Promise<List> {
        try {
            (await requester.shouldHaveBoardAccess(boardId)).orElseThrowError()

            const extractor = new ParamsExtractor<List>(params).permit(['name', 'pos'])
            const listToInsert = extractor.fill(new List())

            if (!extractor.hasParam('name')) {
                listToInsert.name = 'EmptyName'
            }

            if (!extractor.hasParam('pos')) {
                const maxPos = await ListFacade.getMaxPosForBoardId(boardId)
                listToInsert.pos = maxPos + 1
            }

            const board = await getRepository(Board).findOneById(boardId)
            if (!board) {
                throw new NotFoundException('Board not found')
            }
            listToInsert.board = board

            const list = await getRepository(List).save(listToInsert)

            RealTimeFacade.sendEvent(listCreated(list, boardId))
            return list
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(requester: Requester, listId: number, params: {}): Promise<List> {
        try {
            (await requester.shouldHaveListAccess(listId)).orElseThrowError()

            const extractor = new ParamsExtractor<List>(params).permit(['name', 'pos'])

            const listToUpdate = await ListFacade.getById(listId, { relations: ['board'] })
            extractor.fill(listToUpdate)

            const board = listToUpdate.board

            const list = await getRepository(List).save(listToUpdate)
            delete list.board

            RealTimeFacade.sendEvent(listUpdated(list, board.id))
            return list
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(requester: Requester, listId: number): Promise<void> {
        try {
            (await requester.shouldHaveListAccess(listId)).orElseThrowError()
            
            const list = await ListFacade.getById(listId, { relations: ['board'] })

            const boardId = list.board.id
            delete list.board

            await getRepository(List).removeById(listId)

            RealTimeFacade.sendEvent(listDeleted(list, boardId))
            return
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

}
