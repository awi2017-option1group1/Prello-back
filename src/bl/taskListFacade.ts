import { getEntityManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { TaskList } from '../entities/taskList'
import { ParamsExtractor } from './paramsExtractor'

export class TaskListFacade {

    static async getAllFromCardId(cardId: number): Promise<TaskList[]> {
        const taskLists = await getEntityManager()
                            .getRepository(TaskList)
                            .find({
                                    card: cardId
                            })
        if (taskLists) {
            return taskLists
        } else {
            throw new NotFoundException('No Task List was found')
        }
    }

    static async getById(taskListId: number): Promise<TaskList> {
        const taskList = await getEntityManager()
                            .getRepository(TaskList)
                            .findOneById(taskListId)
        if (taskList) {
            return taskList
        } else {
            throw new NotFoundException('No Task List was found')
        }
    }

    static async delete(taskListId: number): Promise<boolean> {
        try {
            const taskListToDelete = await TaskListFacade.getById(taskListId)
            const deletedTaskList = await getEntityManager()
                    .getRepository(TaskList)
                    .remove(taskListToDelete)
            if (deletedTaskList) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(taskListReceived: TaskList, taskListToUpdate: TaskList): Promise<TaskList> {
        try {
            const taskListToSave = ParamsExtractor.extract<TaskList>(['title'], taskListReceived, taskListToUpdate)
            const repository = getEntityManager().getRepository(TaskList)
            return repository.persist(taskListToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(taskList: TaskList, cardId: number): Promise<TaskList> {
        try {
            let taskListToCreate = new TaskList()
            taskListToCreate = ParamsExtractor.extract<TaskList>(['title', 'card'], taskList, taskListToCreate)
            return getEntityManager().getRepository(TaskList).persist(taskListToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
