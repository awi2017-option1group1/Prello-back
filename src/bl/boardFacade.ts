import { getEntityManager } from 'typeorm'

import { BoardNotFoundException } from './errors/BoardNotFoundException'
import { Board } from '../entities/board'

export class BoardFacade {

    static async getAll(): Promise<Board[]>  {
        const boards = await getEntityManager()
                            .getRepository(Board)
                            .find()
        if (boards) {
            return boards
        } else {
            throw new BoardNotFoundException('No Board was found')
        }
    }

    static async getAllFromTeamId(teamId: number): Promise<Board[]> {
        const boards = await getEntityManager()
                            .getRepository(Board)
                            .find({
                                where: {
                                    teamId: teamId
                                }
                            })
        if (boards) {
            return boards
        } else {
            throw new BoardNotFoundException('No Board was found')
        }
    }

    static async getAllFromUserId(userId: number): Promise<Board[]> {
        const boards = await getEntityManager()
                            .getRepository(Board)
                            .find({
                                where: {
                                    userId: userId
                                }
                            })
        if (boards) {
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
            BoardFacade.getById(boardId).then(async (board: Board) => {
                await getEntityManager()
                    .getRepository(Board)
                    .remove(board)
                    .then((deletedBoard: Board) => {
                        if (deletedBoard) {
                            return true
                        } else {
                            return false
                        }
                })
            })
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
        return false
    }

    static async update(board: Board): Promise<Board> {
        try {
            const repository = getEntityManager().getRepository(Board)
            let boardToUpdate = await BoardFacade.getById(board.id)
            boardToUpdate = board
            return repository.persist(boardToUpdate)
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
    }

    static async create(board: Board): Promise<Board> {
        try {
            return getEntityManager().getRepository(Board).create(Board)
        } catch (e) {
            throw new BoardNotFoundException(e)
        }
    }
}
