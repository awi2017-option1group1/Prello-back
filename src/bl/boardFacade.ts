import { getManager, getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Board } from '../entities/board'
import { ParamsExtractor } from './paramsExtractorv2'

import { NotificationFacade } from './notificationFacade'
import { User } from '../entities/user'
<<<<<<< HEAD
import { Tag } from '../entities/tag'
import { BadRequest } from '../bl/errors/BadRequest'
=======
import { Requester } from './requester'
>>>>>>> 43a0f87e434a090c3c6ec54adab7e4c4fd6943f0

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

    static async update(params: {}, boardId: number, requester: Requester): Promise<Board> {
        try {
            const extractor = new ParamsExtractor<Board>(params).permit(['name', 'isPrivate'])
            let board = await BoardFacade.getById(requester, boardId)
            extractor.fill(board)
            board = await getRepository(Board).save(board)
            NotificationFacade.createBoardUpdateNotifications(boardId, requester.getUID())
            return board
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

    // --------------- Members ---------------

    static async getAllMembersFromBoardId(boardId: number): Promise<User[]> {
        const board = await BoardFacade.getById(boardId, { relations: ['users'] })
        return board.users
    }

    static async assignMember(boardId: number, params: {}): Promise<User> {
        const extractor = new ParamsExtractor<Board>(params).require(['username'])

        const userToAssign = await UserFacade.getByUsername(extractor.getParam('username'))
        const boardToUpdate = await BoardFacade.getById(boardId, { relations: ['users'] })

        boardToUpdate.users = boardToUpdate.users.concat(userToAssign)

        await getRepository(Board).save(boardToUpdate)
        return userToAssign
    }

<<<<<<< HEAD
    static async search(value: string): Promise<Board[]> {
        try {
            const realValue = `%${value}%`
            const boards = await getRepository(Board)
            .createQueryBuilder('board')
            .select()
            .where('board.name LIKE :realValue', { realValue })
            .getMany()

            if (boards) {
                const realBoards = boards.map(b => b = Object(
                    {title: b.name, description: '', link: `/boards/${b.id}`}))
                return realBoards
            }
            return []
            
        } catch (e) {
            throw new BadRequest(e)
        }
    }
=======
    static async unassignMemberById(boardId: number, memberId: number): Promise<void> {
        const userToUnassign = await UserFacade.getById(memberId)
        const boardToUpdate = await BoardFacade.getById(boardId, { relations: ['users'] })

        boardToUpdate.users = boardToUpdate.users.filter(user => user.id !== userToUnassign.id)

        await getRepository(Board).save(boardToUpdate)
    }

>>>>>>> 43a0f87e434a090c3c6ec54adab7e4c4fd6943f0
}
