import { getManager } from 'typeorm'

import { BoardNotFoundException } from './errors/BoardNotFoundException'
import { Board } from '../entities/board'
import { ParamsExtractor } from './paramsExtractor'

export class BoardFacade {

    static async getAllFromTeamId(teamId: number): Promise<Board[]> {
        const boards = await getManager()
                            .getRepository(Board)
                            .find()
        if (boards) {
            return boards
        } else {
            throw new BoardNotFoundException('No Board was found')
        }
    }

    static async getAllFromUserId(userId: number): Promise<Board[]> {
        const boards = await getManager()
                            .getRepository(Board)
                            .find({
                                join: {
                                    alias: 'user',
                                    leftJoinAndSelect: {
                                        'user_id': 'user.id'
                                    }
                                }
                            })
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

    static async update(boardReceived: Board, boardToUpdate: Board): Promise<Board> {
        try {
            const board = ParamsExtractor.extract<Board>(['title', 'isPrivate'], boardReceived, boardToUpdate)
            const repository = getManager().getRepository(Board)
            return repository.save(board)
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
    }

    static async create(board: Board): Promise<Board> {
        try {
            let boardToCreate = new Board()
            boardToCreate = ParamsExtractor.extract<Board>(['title', 'isPrivate'], board, boardToCreate)
            return getManager().getRepository(Board).save(boardToCreate)
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
    }
}
