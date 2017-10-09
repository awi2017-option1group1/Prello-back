import { getEntityManager } from 'typeorm'

import { ListNotFoundException } from './errors/ListNotFoundException'
import { List } from '../entities/list'

export class ListFacade {

    static async getAllFromBoardId(boardId: number): Promise<List[]> {
        const lists = await getEntityManager()
                            .getRepository(List)
                            .find({
                                where: {
                                    boardId: boardId
                                }
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

    static async insertFromBoardId(boardId: number): Promise<boolean> {
        //ToDo
        return false
    }

    static async update(listId: number): Promise<List> {
        try {
            const repository = getEntityManager().getRepository(List)
            let listToUpdate = await ListFacade.getById(listId)
            listToUpdate = list
            return repository.persist(listToUpdate)
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
