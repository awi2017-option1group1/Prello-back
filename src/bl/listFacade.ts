import { getManager } from 'typeorm'

import { ListNotFoundException } from './errors/ListNotFoundException'
import { List } from '../entities/list'
import { BoardFacade } from './boardFacade'
import { ParamsExtractor } from './paramsExtractor'

export class ListFacade {

    static async getAllFromBoardId(boardId: number): Promise<List[]> {
        const board = await BoardFacade.getById(boardId)
        const lists = board.lists
        if (lists) {
            return lists
        } else {
            throw new ListNotFoundException('No Board was found')
        }
    }

    static async getById(listId: number): Promise<List> {
        const list = await getManager()
                            .getRepository(List)
                            .findOneById(listId)
        if (list) {
            return list
        } else {
            throw new ListNotFoundException('No Board was found')
        }
    }

    static async insertFromBoardId(boardId: number, list: List): Promise<List> {
        try {
            let listToInsert = ParamsExtractor.extract<List>(['title', 'rank'], list)
            listToInsert.board = await BoardFacade.getById(boardId)
            return getManager().getRepository(List).create(listToInsert)
        } catch (e) {
            throw new ListNotFoundException(e)
        }
    }

    static async update(listReceived: List): Promise<void> {
        try {
            const listToSave = ParamsExtractor.extract<List>(['title', 'rank'], listReceived)
            const repository = getManager().getRepository(List)
            return repository.updateById(listReceived.id, listToSave)
        } catch (e) {
            throw new ListNotFoundException(e)
        }
    }

    static async delete(listId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(List)
                    .removeById(listId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new ListNotFoundException(e)
        }
    }

}
