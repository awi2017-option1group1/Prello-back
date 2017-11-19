import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'
import { ParamsExtractor } from './paramsExtractorv2'

import { ListFacade } from './listFacade'
import { TagFacade } from './tagFacade'

import { Requester } from './requester'
import { User } from '../entities/user'
import { Tag } from '../entities/tag'
import { Card } from '../entities/card'
import { Comment } from '../entities/comment'

import { RealTimeFacade } from './realtimeFacade'
import { tagAssigned, tagUnassigned } from './realtime/label'
import { cardMemberAssigned, cardMemberUnassigned } from './realtime/member'
import { cardCreated, cardUpdated, cardDeleted } from './realtime/card'

export class CardFacade {

    static async getAllFromListId(requester: Requester, listId: number): Promise<Card[]> {
        (await requester.shouldHaveListAccess(listId)).orElseThrowError()

        return await getRepository(Card)
            .createQueryBuilder('card')
            .leftJoin('card.list', 'list')
            .where('list.id = :listId', { listId })
            .orderBy({ 'card.pos': 'ASC' })
            .getMany()
    }

    static async getById(cardId: number, options?: {}): Promise<Card> {
        const card = await getRepository(Card).findOne({
            ...options,
            where: {
                id: cardId
            }
        })
        if (card) {
            return card
        } else {
            throw new NotFoundException('Card not found')
        }
    }

    static async getByIdExtended(cardId: number): Promise<Card> {
        const card = await getRepository(Card)            
            .createQueryBuilder('card')
            .leftJoinAndSelect('card.list', 'list')
            .leftJoinAndSelect('list.board', 'board')
            .where('card.id = :cardId', { cardId })
            .getOne()
        if (card) {
            return card
        } else {
            throw new NotFoundException('Card not found')
        }
    }

    static async getByIdWithBoard(cardId: number): Promise<Card> {
        const card = await getRepository(Card)
            .createQueryBuilder('card')
            .leftJoinAndSelect('card.list', 'list')
            .leftJoinAndSelect('list.board', 'board')
            .where('card.id = :cardId', { cardId })
            .getOne()
        if (card) {
            return card
        } else {
            throw new NotFoundException('Card not found')
        }
    }

    static async getMaxPosForListId(listId: number): Promise<number> {
        const { max } = await getRepository(Card)
            .createQueryBuilder('card')
            .select('MAX(card.pos)', 'max')
            .leftJoin('card.list', 'list')
            .where('list.id = :listId', { listId })
            .getRawOne()
        return max
    }

    static async insertFromListId(requester: Requester, listId: number, params: {}): Promise<Card> {
        try {
            (await requester.shouldHaveListAccess(listId)).orElseThrowError()

            const extractor = new ParamsExtractor<Card>(params)
                .require(['name'])
                .permit(['closed', 'desc', 'due', 'dueComplete', 'pos'])
            const cardToInsert = extractor.fill(new Card())

            if (!extractor.hasParam('pos')) {
                const maxPos = await CardFacade.getMaxPosForListId(listId)
                cardToInsert.pos = maxPos + 1
            }

            const attachedList = await ListFacade.getById(listId, { relations: ['board'] })
            cardToInsert.list = attachedList

            const card = await getRepository(Card).save(cardToInsert)

            const board = attachedList.board
            delete card.list // Remove the list property from the card object to not send it in the response
            RealTimeFacade.sendEvent(cardCreated(requester, card, attachedList, board.id))

            return card
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(requester: Requester, cardId: number, params: {}): Promise<Card> {
        try {
            (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

            const extractor = new ParamsExtractor<Card>(params)
                .permit(['name', 'closed', 'desc', 'due', 'dueComplete', 'pos', 'listId'])
            
            const cardToUpdate = await CardFacade.getByIdWithBoard(cardId)
            extractor.fill(cardToUpdate)

            if (extractor.hasParam('listId')) {
                const newList = await ListFacade.getById(extractor.getParam('listId'), { relations: ['board'] })
                if (newList && newList.board.id === cardToUpdate.list.board.id) {
                    cardToUpdate.list = newList
                } else {
                    throw new BadRequest('The card needs to stay in the same board')
                }
            }

            const card = await getRepository(Card).save(cardToUpdate)

            const list = card.list
            delete card.list // Remove the list property from the card object to not send it in the response
            RealTimeFacade.sendEvent(cardUpdated(requester, card, list, list.board.id))

            return card
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(requester: Requester, cardId: number): Promise<void> {
        try {
            (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

            const card = await CardFacade.getByIdWithBoard(cardId)

            const boardId = card.list.board.id
            delete card.list

            await getRepository(Card).removeById(cardId)

            RealTimeFacade.sendEvent(cardDeleted(requester, card, boardId))
            return
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    // --------------- Members ---------------

    static async getAllMembersFromCardId(requester: Requester, cardId: number): Promise<User[]> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const users = await CardFacade.getById(cardId, { relations: ['members'] })
        return users.members
    }

    static async assignMember(requester: Requester, cardId: number, params: {}): Promise<User> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const extractor = new ParamsExtractor<Card>(params).require(['userId'])

        const userToAssign = await getRepository(User).findOneById(
            extractor.getParam('userId'), 
            { relations: ['cards'] }
        )
        if (!userToAssign) {
            throw new NotFoundException('User not found!')
        }
        const cardToUpdate = await CardFacade.getByIdWithBoard(cardId)

        userToAssign.cards = userToAssign.cards.concat(cardToUpdate)

        await getRepository(User).save(userToAssign)
        delete userToAssign.cards

        const boardId = cardToUpdate.list.board.id
        delete cardToUpdate.list
        RealTimeFacade.sendEvent(cardMemberAssigned(requester, boardId, cardToUpdate, userToAssign))

        return userToAssign
    }

    static async unassignMemberById(requester: Requester, cardId: number, memberId: number): Promise<void> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const userToUnassign = await getRepository(User).findOneById(
            memberId,
            { relations: ['cards'] }
        )
        if (!userToUnassign) {
            throw new NotFoundException('User not found!')
        }
        const cardToUpdate = await CardFacade.getByIdWithBoard(cardId)

        userToUnassign.cards = userToUnassign.cards.filter(c => c.id !== cardToUpdate.id)
        
        await getRepository(User).save(userToUnassign)
        delete userToUnassign.cards

        const boardId = cardToUpdate.list.board.id
        delete cardToUpdate.list
        RealTimeFacade.sendEvent(cardMemberUnassigned(requester, boardId, cardToUpdate, userToUnassign))

        return
    }
    
    // --------------- Labels ---------------

    static async assignLabel(requester: Requester, cardId: number, params: {}): Promise<Tag> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const extractor = new ParamsExtractor<Card>(params).require(['labelId'])

        const labelToAssign = await TagFacade.getById(extractor.getParam('labelId'), { relations: ['cards'] })
        const cardToUpdate = await CardFacade.getByIdWithBoard(cardId)

        labelToAssign.cards = labelToAssign.cards.concat(cardToUpdate)
        
        await getRepository(Tag).save(labelToAssign)
        delete labelToAssign.cards

        const boardId = cardToUpdate.list.board.id
        delete cardToUpdate.list
        RealTimeFacade.sendEvent(tagAssigned(requester, labelToAssign, cardToUpdate, boardId))  

        return labelToAssign
    }

    static async unassignLabelById(requester: Requester, cardId: number, labelId: number): Promise<void> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const labelToUnassign = await TagFacade.getById(labelId, { relations: ['cards'] })
        const cardToUpdate = await CardFacade.getByIdWithBoard(cardId)

        labelToUnassign.cards =  labelToUnassign.cards.filter(card => card.id !== cardToUpdate.id)

        await getRepository(Tag).save(labelToUnassign)
        delete labelToUnassign.cards

        const boardId = cardToUpdate.list.board.id
        delete cardToUpdate.list
        RealTimeFacade.sendEvent(tagUnassigned(requester, labelToUnassign, cardToUpdate, boardId))  

        return
    }

    static async getAllFromCardId(requester: Requester, cardId: number): Promise<Comment[]> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const comments = await getRepository(Comment)
            .createQueryBuilder('comment')
            .leftJoin('comment.card', 'card')
            .leftJoinAndSelect('comment.user', 'user')
            .where('card.id = :cardId', { cardId })
            .orderBy({ 'comment.createdDate': 'ASC' })
            .getMany()
        if (comments) {
            return comments.map((comment) => ({
                ...comment,
                user: {
                    id: comment.user.id,
                    username: comment.user.username,
                    avatarColor: comment.user.avatarColor
                } as User
            }))
        } 
        return []
    }

    static async search(value: string): Promise<Card[]> {
        try {
            const realValue = `%${value}%`
            const cards = await getRepository(Card)
            .createQueryBuilder('card')
            .select()
            .leftJoinAndSelect('card.list', 'list')
            .leftJoinAndSelect('list.board', 'board')
            .where('card.name LIKE :realValue', { realValue })
            .getMany()
            if (cards) {
                const realCards = cards.map(c => 
                    c = Object({title: c.name, description: c.desc, link: `/boards/${c.list.board.id}/cards/${c.id}`}))
                return realCards
            }
            return []
            
        } catch (e) {
            throw new BadRequest(e)
        }
    }
}
