import { getManager } from 'typeorm'

import { BoardNotFoundException } from './errors/BoardNotFoundException'
import { Board } from '../entities/board'
import { ParamsExtractor } from './paramsExtractor'
import { UserFacade } from './userFacade'

export class BoardFacade {

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
            throw new BoardNotFoundException('No Board was found')
        }
    }

    static async getAllFromUserId(userId: number): Promise<Board[]> {
        const user = await UserFacade.getById(userId)
        const boards = user.boards
        if (boards) {
            return boards
        } else {
            throw new BoardNotFoundException('No Board was found')
        }
    }

    static async getById(boardId: number): Promise<Board> {
        const board = await getManager()
                            .getRepository(Board)
                            .findOneById(boardId)
        if (board) {
            return board
        } else {
            throw new BoardNotFoundException('No Board was found')
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
            throw new BoardNotFoundException(e)
        }
    }

    static async update(boardReceived: Board): Promise<void> {
        try {
            const board = ParamsExtractor.extract<Board>(['title', 'isPrivate'], boardReceived)
            const repository = getManager().getRepository(Board)
            return repository.updateById(boardReceived.id, board)
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
    }

    static async create(board: Board): Promise<Board> {
        try {
            let boardToCreate = ParamsExtractor.extract<Board>(['title', 'isPrivate'], board)
            return getManager().getRepository(Board).create(boardToCreate)
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
    }
}
