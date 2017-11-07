import { getManager, getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Board } from '../entities/board'
import { ParamsExtractor } from './paramsExtractor'
import { UserFacade } from './userFacade'
import { List } from '../entities/list'
import { User } from '../entities/user'
import { Tag } from '../entities/tag'

export class BoardFacade {

    static async checkAuthorization(board: Board, user: User) {
        return true
        // const users = await board.users
        // return users.findIndex(u => u.id === user.id) !== -1
    }

    static async getAllFromTeamId(teamId: number): Promise<Board[]> {
        const boards = await getManager()
                            .getRepository(Board)
                            .find({
                                where: {
                                    'teamId': teamId
                                }
                            })
        if (boards) {
            return boards
        } else {
            throw new NotFoundException('No Board was found')
        }
    }

    static async getAllFromUserId(userId: number): Promise<Board[]> {
        const user = await UserFacade.getById(userId)
        const boards = await user.boards
        if (boards) {
            return boards
        } else {
            throw new NotFoundException('No Board was found')
        }
    }

    static async getById(boardId: number): Promise<Board> {
        const board = await getRepository(Board).findOneById(boardId)
        if (board) {
            return board
        } else {
            throw new NotFoundException('Board not found')
        }
    }

    static async delete(boardId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(Board)
                    .removeById(boardId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(boardReceived: Board, boardId: number): Promise<void> {
        try {
            const board = ParamsExtractor.extract<Board>(['title', 'isPrivate'], boardReceived)
            const repository = getManager().getRepository(Board)
            return repository.updateById(boardId, board)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    /*
    static async updateMember(boardReceived: Board, boardId: number, memberId: number): Promise<void> {
        try {
            const repository = getManager().getRepository(BoardRole)
            const boardRole = repository.find({
                where: {
                    user.id=
                }
            })

            return repository.updateById(boardId, board)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async updateMembers(boardReceived: Board, boardId: number, memberId: number): Promise<void> {
        try {
            const board = ParamsExtractor.extract<Board>(['title', 'isPrivate'], boardReceived)
            const repository = getManager().getRepository(Board)
            return repository.updateById(boardId, board)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }*/

    static async create(board: Board): Promise<Board> {
        try {
            let boardToCreate = ParamsExtractor.extract<Board>(['title', 'isPrivate'], board)
            return getManager().getRepository(Board).create(boardToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async addLabel(label: Tag, boardId: number): Promise<void> {
        const repository = await getManager()
                            .getRepository(Board)

        var board = await repository.findOneById(boardId)
        if (board) {
            const tags = await board.tags
            if (tags) {
                board.tags = Promise.resolve(tags.concat(label))
                return repository.updateById(boardId, board)
            } else {
                throw new NotFoundException('No Board was found')
            }
        } else {
            throw new NotFoundException('No Board was found')
        }
    }

    static async addList(list: List, boardId: number): Promise<void> {
        const repository = await getManager()
                            .getRepository(Board)

        var board = await repository.findOneById(boardId)
        if (board) {
            const lists = await board.lists
            if (lists) {
                board.lists = Promise.resolve(lists.concat(list))
                return repository.updateById(boardId, board)
            } else {
                throw new NotFoundException('No Board was found')
            }
        } else {
            throw new NotFoundException('No Board was found')
        }
    }
}
