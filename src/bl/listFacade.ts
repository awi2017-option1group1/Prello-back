import { getEntityManager } from 'typeorm'

import { ListNotFoundException } from './errors/ListNotFoundException'
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
            throw new ListNotFoundException('No Board was found')
        }
    }

    static async getById(listId: number): Promise<List> {
        const list = await getEntityManager()
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
            let listToInsert = new List()
            listToInsert = ParamsExtractor.extractList(['title', 'rank'], list, listToInsert)
            return getEntityManager().getRepository(List).persist(listToInsert)                 
        } catch (e) {
            throw new ListNotFoundException(e)
        }
    }   

    static async update(listReceived: List, listToUpdate: List): Promise<List> {
        try {
            const listToSave = ParamsExtractor.extractList(['title', 'rank'], listReceived, listToUpdate)
            const repository = getEntityManager().getRepository(List)
            return repository.persist(listToSave)
        } catch (e) {
            throw new ListNotFoundException(e)
        }
    }

    static async delete(listId: number): Promise<boolean> {
        try {
            ListFacade.getById(listId).then(async (list: List) => {
                await getEntityManager()
                    .getRepository(List)
                    .remove(list)
                    .then((deletedList: List) => {
                        if (deletedList) {
                            return true
                        } else {
                            return false
                        }
                })
            })
        } catch (e) {
            throw new ListNotFoundException(e)
        }
        return false
    }

}