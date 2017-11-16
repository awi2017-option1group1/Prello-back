import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'
import { ParamsExtractor } from './paramsExtractorv2'

import { List } from '../entities/list'
import { BoardFacade } from './boardFacade'

import { RealTimeFacade } from './realtimeFacade'
import { listCreated, listUpdated, listDeleted } from './realtime/realtimeList'

export class ListFacade {

    static async getAllFromBoardId(boardId: number): Promise<List[]> {
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

    static async insertFromBoardId(boardId: number, params: {}): Promise<List> {
        try {
            const extractor = new ParamsExtractor<List>(params).permit(['name', 'pos'])
            const listToInsert = extractor.fill(new List())

            if (!extractor.hasParam('name')) {
                listToInsert.name = 'EmptyName'
            }

            if (!extractor.hasParam('pos')) {
                const maxPos = await ListFacade.getMaxPosForBoardId(boardId)
                listToInsert.pos = maxPos + 1
            }

            listToInsert.board = await BoardFacade.getById(boardId)

            const list = await getRepository(List).save(listToInsert)

            RealTimeFacade.sendEvent(listCreated(list, boardId))
            return list
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(listId: number, params: {}): Promise<List> {
        try {
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

    static async delete(listId: number): Promise<void> {
        try {
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

    static async search(value: string): Promise<List[]> {
        try {
            const realValue = `%${value}%`
            const lists = await getRepository(List)
            .createQueryBuilder('list')
            .select(['board.id', 'list.name'])
            .leftJoin('list.board', 'board')
            .where('list.name LIKE :realValue', { realValue })
            .getMany()
            console.log(lists)
            if (lists) {
                const realLists = lists.map(l => 
                    l = Object({name: l.name, description: '', link: `/boards/${l.board.id}`}))
                return realLists
            }
            return []
            
        } catch (e) {
            throw new BadRequest(e)
        }
    }

}
