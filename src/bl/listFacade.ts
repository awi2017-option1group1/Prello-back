import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { ParamsExtractor } from './paramsExtractorv2'

import { List } from '../entities/list'
import { BoardFacade } from './boardFacade'

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

    static async getById(listId: number): Promise<List> {
        const list = await getRepository(List).findOneById(listId)
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

            return getRepository(List).save(listToInsert)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(listId: number, params: {}): Promise<List> {
        try {
            const extractor = new ParamsExtractor<List>(params).permit(['name', 'pos'])

            const list = await ListFacade.getById(listId)
            extractor.fill(list)

            return await getRepository(List).save(list)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async delete(listId: number): Promise<void> {
        try {
            await getRepository(List).removeById(listId)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

}
