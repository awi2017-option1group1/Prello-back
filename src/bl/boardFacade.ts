import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'
import { ParamsExtractor } from './paramsExtractorv2'

import { NotificationFacade } from './notificationFacade'
import { UserFacade } from './userFacade'
import { Board } from '../entities/board'
import { User } from '../entities/user'
import { Requester } from './requester'

import { RealTimeFacade } from './realtimeFacade'
import { boardUpdated } from './realtime/board'

export class BoardFacade {

    static async hasAccess(userId: number, boardId: number): Promise<boolean> {
        const board = await getRepository(Board)
            .createQueryBuilder('board')
            .leftJoin('board.users', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('board.id = :boardId', { boardId })
            .getOne()
        console.log(board)
        return board !== undefined
    }

    static async getAllFromUserId(requester: Requester, userId: number): Promise<Board[]> {
        requester.shouldHaveUid(userId).orElseThrowError()

        return await getRepository(Board)
            .createQueryBuilder('board')
            .leftJoin('board.users', 'user')
            .where('user.id = :userId', { userId })
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

    static async delete(requester: Requester, boardId: number): Promise<void> {
        try {
            (await requester.shouldHaveBoardAccess(boardId)).orElseThrowError()
            await getRepository(Board).removeById(boardId)
            return
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(requester: Requester, boardId: number, params: {}): Promise<Board> {
        try {
            const extractor = new ParamsExtractor<Board>(params).permit(['name', 'isPrivate'])

            let board = await BoardFacade.getById(requester, boardId)
            extractor.fill(board)

            board = await getRepository(Board).save(board)

            RealTimeFacade.sendEvent(boardUpdated(board))
            NotificationFacade.createBoardUpdateNotifications(boardId, requester.getUID())

            return board
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

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
            console.error(e)
            throw new BadRequest(e)
        }
    }

    // --------------- Members ---------------

    static async getAllMembersFromBoardId(requester: Requester, boardId: number): Promise<User[]> {
        const board = await BoardFacade.getById(requester, boardId, { relations: ['users'] })
        return board.users
    }

    static async assignMember(requester: Requester, boardId: number, params: {}): Promise<User> {
        try {
            const extractor = new ParamsExtractor<Board>(params).require(['username'])
    
            const boardToUpdate = await BoardFacade.getById(requester, boardId, { relations: ['users'] })
            const userToAssign = await UserFacade.getByUsername(extractor.getParam('username'))
    
            boardToUpdate.users = boardToUpdate.users.concat(userToAssign)
    
            await getRepository(Board).save(boardToUpdate)
            return userToAssign
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async unassignMemberById(requester: Requester, boardId: number, memberId: number): Promise<void> {
        try {
            const boardToUpdate = await BoardFacade.getById(requester, boardId, { relations: ['users'] })
            const userToUnassign = await UserFacade.getById(requester, memberId)
    
            if (boardToUpdate.users.length > 1) {
                boardToUpdate.users = boardToUpdate.users.filter(user => user.id !== userToUnassign.id)
            }
    
            await getRepository(Board).save(boardToUpdate)
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

}
