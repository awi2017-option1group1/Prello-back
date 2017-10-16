import { getManager } from 'typeorm'

import { TaskListNotFoundException } from './errors/TaskListNotFoundException'
import { TaskList } from '../entities/taskList'
import { ParamsExtractor } from './paramsExtractor'

export class TaskListFacade {

    static async getAllFromCardId(cardId: number): Promise<TaskList[]> {
        const taskLists = await getManager()
                            .getRepository(TaskList)
                            .find()
        if (taskLists) {
            return taskLists
        } else {
            throw new TaskListNotFoundException('No Task List was found')
        }
    }

    static async getById(taskListId: number): Promise<TaskList> {
        const taskList = await getManager()
                            .getRepository(TaskList)
                            .findOneById(taskListId)
        if (taskList) {
            return taskList
        } else {
            throw new TaskListNotFoundException('No Task List was found')
        }
    }

    static async delete(taskListId: number): Promise<boolean> {
        try {
            const taskListToDelete = await TaskListFacade.getById(taskListId)
            const deletedTaskList = await getManager()
                    .getRepository(TaskList)
                    .remove(taskListToDelete)
            if (deletedTaskList) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new TaskListNotFoundException(e)
        }
    }

    static async update(taskListReceived: TaskList, taskListToUpdate: TaskList): Promise<TaskList> {
        try {
            const taskListToSave = ParamsExtractor.extract<TaskList>(['title'], taskListReceived, taskListToUpdate)
            const repository = getManager().getRepository(TaskList)
            return repository.save(taskListToSave)
        } catch (e) {
            throw new TaskListNotFoundException(e)
        }
    }

    static async create(taskList: TaskList, cardId: number): Promise<TaskList> {
        try {
            let taskListToCreate = new TaskList()
            taskListToCreate = ParamsExtractor.extract<TaskList>(['title', 'card'], taskList, taskListToCreate)
            return getManager().getRepository(TaskList).save(taskListToCreate)
        } catch (e) {
            throw new TaskListNotFoundException(e)
        }
    }
}
