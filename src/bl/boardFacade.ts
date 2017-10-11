import { getEntityManager } from 'typeorm'

import { BoardNotFoundException } from './errors/BoardNotFoundException'
import { Board } from '../entities/board'
import { ParamsExtractor } from './paramsExtractor'
export class BoardFacade {

    static async getAll(): Promise<Board[]>  {
        const boards = await getEntityManager()
                            .getRepository(Board)
                            .find()
        if (boards && boards.length !== 0) {
            return boards
        } else {
            throw new BoardNotFoundException('No Board was found')
        }
    }

    static async getAllFromTeamId(teamId: number): Promise<Board[]> {
        const boards = await getEntityManager()
                            .getRepository(Board)
                            .find({
                                    team: teamId
                            })
        if (boards && boards.length !== 0) {
            return boards
        } else {
            throw new BoardNotFoundException('No Board was found')
        }
    }

    static async getAllFromUserId(userId: number): Promise<Board[]> {
        const boards = await getEntityManager()
                            .getRepository(Board)
                            .find({
                                join: {
                                    alias: 'user',
                                    leftJoinAndSelect: {
                                        'user_id': 'user.id'
                                    }
                                }
                            })
        if (boards && boards.length !== 0) {
            return boards
        } else {
            throw new BoardNotFoundException('No Board was found')
        }
    }

    static async getById(boardId: number): Promise<Board> {
        const board = await getEntityManager()
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
            const boardToDelete = await BoardFacade.getById(boardId)
            const deletedBoard = await getEntityManager()
                    .getRepository(Board)
                    .remove(boardToDelete)
            if (deletedBoard) {
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
            const board = ParamsExtractor.extractBoard(['title', 'isPrivate'], boardReceived, boardToUpdate)
            const repository = getEntityManager().getRepository(Board)
            return repository.persist(board)
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
    }

    static async create(board: Board): Promise<Board> {
        try {
            let boardToCreate = new Board()
            boardToCreate = ParamsExtractor.extractBoard(['title', 'isPrivate'], board, boardToCreate)
            return getEntityManager().getRepository(Board).persist(boardToCreate)
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
    }
}
