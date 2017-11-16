import { getManager, getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Board } from '../entities/board'
import { ParamsExtractor } from './paramsExtractorv2'
import { User } from '../entities/user'
import { Requester } from './requester'

export class BoardFacade {

    static async hasAccess(userId: number, boardId: number): Promise<boolean> {
        const board = await getRepository(Board)
            .createQueryBuilder('board')
            .leftJoin('board.users', 'user')
            .where('user.id = :userId', { userId })
            .where('board.id = :boardId', { boardId })
            .getOne()
        return board !== undefined
    }

    static async getAllFromUserId(requester: Requester, userId: number): Promise<Board[]> {
        requester.shouldHaveUid(userId).orElseThrowError()

        return await getRepository(Board)
            .createQueryBuilder('board')
            .leftJoin('board.users', 'user')
            .where('user.id = :userId', { userId: userId })
            .getMany()
    }

    static async getById(requester: Requester, boardId: number, options?: {}): Promise<Board> {
        (await requester.shouldHaveBoardAccess(boardId)).orElseThrowError()

        const board = await getRepository(Board).findOne({
            ...options,
            where: {
                id: boardId
            }
        })
        if (board) {
            return board
        } else {
            throw new NotFoundException('Board not found')
        }
    }

    static async delete(requester: Requester, boardId: number): Promise<boolean> {
        try {
            (await requester.shouldHaveBoardAccess(boardId)).orElseThrowError()

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

    static async update(requester: Requester, params: {}, boardId: number): Promise<Board> {
        try {
            (await requester.shouldHaveBoardAccess(boardId)).orElseThrowError()

            const extractor = new ParamsExtractor<Board>(params).permit(['name', 'isPrivate'])
            const board = await BoardFacade.getById(requester, boardId)
            extractor.fill(board)
            return await getRepository(Board).save(board)
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

    static async create(requester: Requester, params: {}): Promise<Board> {
        try {
            const extractor = new ParamsExtractor<Board>(params).permit(['name', 'isPrivate'])
            const boardToInsert = extractor.fill(new Board())

            if (!extractor.hasParam('name')) {
                boardToInsert.name = 'EmptyName'
            }

            if (!extractor.hasParam('isPrivate')) {
                boardToInsert.isPrivate = true
            }

            const user = await getRepository(User).findOneById(requester.getUID())
            if (!user) {
                throw new NotFoundException('User not found!')
            }
            boardToInsert.users = [user]

            return getRepository(Board).save(boardToInsert)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
