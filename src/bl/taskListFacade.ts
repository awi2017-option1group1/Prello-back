import { getManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { TaskList } from '../entities/taskList'
import { ParamsExtractor } from './paramsExtractor'
import { CardFacade } from './cardFacade'

export class TaskListFacade {

    static async getAllFromCardId(cardId: number): Promise<TaskList[]> {
        const card = await CardFacade.getById(cardId)
        const taskLists = card.tasksLists
        if (taskLists) {
            return taskLists
        } else {
            throw new NotFoundException('No Task List was found')
        }
    }

    static async getById(taskListId: number): Promise<TaskList> {
        const taskList = await getManager()
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
            const deletionSuccess = await getManager()
                    .getRepository(TaskList)
                    .removeById(taskListId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(taskListReceived: TaskList, taskListToUpdate: TaskList): Promise<void> {
        try {
            const taskListToSave = ParamsExtractor.extract<TaskList>(['title'], taskListReceived)
            const repository = getManager().getRepository(TaskList)
            return repository.updateById(taskListReceived.id, taskListToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(taskList: TaskList, cardId: number): Promise<TaskList> {
        try {
            let taskListToCreate = ParamsExtractor.extract<TaskList>(['title', 'card'], taskList)
            taskListToCreate.card = await CardFacade.getById(cardId)
            return getManager().getRepository(TaskList).create(taskListToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
