import { getEntityManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { List } from '../entities/list'

import { ParamsExtractor } from './paramsExtractor'

export class ListFacade {

    static async getAllFromBoardId(boardId: number): Promise<List[]> {
        const lists = await getEntityManager()
                            .getRepository(List)
                            .find({
                                board: boardId
                        })
        if (lists) {
            return lists
        } else {
            throw new NotFoundException('No Board was found')
        }
    }

    static async getById(listId: number): Promise<List> {
        const list = await getEntityManager()
                            .getRepository(List)
                            .findOneById(listId)
        if (list) {
            return list
        } else {
            throw new NotFoundException('No Board was found')
        }
    }

    static async insertFromBoardId(boardId: number, list: List): Promise<List> {
        try {
            let listToInsert = new List()
            listToInsert = ParamsExtractor.extract<List>(['title', 'rank'], list, listToInsert)
            return getEntityManager().getRepository(List).persist(listToInsert)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(listReceived: List, listToUpdate: List): Promise<List> {
        try {
            const listToSave = ParamsExtractor.extract<List>(['title', 'rank'], listReceived, listToUpdate)
            const repository = getEntityManager().getRepository(List)
            return repository.persist(listToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async delete(listId: number): Promise<boolean> {
        try {
            const list = await ListFacade.getById(listId)
            const deletedList = await getEntityManager()
                    .getRepository(List)
                    .remove(list)
            if (deletedList) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

}
