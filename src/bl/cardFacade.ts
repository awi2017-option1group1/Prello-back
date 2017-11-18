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

            RealTimeFacade.sendEvent(cardCreated(card, board.id))
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

            const board = card.list.board
            delete card.list // Remove the list property from the card object to not send it in the response

            RealTimeFacade.sendEvent(cardUpdated(card, board.id))
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

            RealTimeFacade.sendEvent(cardDeleted(card, boardId))
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

        const userToAssign = await getRepository(User).findOneById(extractor.getParam('userId'))
        if (!userToAssign) {
            throw new NotFoundException('User not found!')
        }
        const cardToUpdate = await CardFacade.getById(cardId, { relations: ['members'] })

        cardToUpdate.members = cardToUpdate.members.concat(userToAssign)

        await getRepository(Card).save(cardToUpdate)
        return userToAssign
    }

    static async unassignMemberById(requester: Requester, cardId: number, memberId: number): Promise<void> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const userToUnassign = await getRepository(User).findOneById(memberId)
        if (!userToUnassign) {
            throw new NotFoundException('User not found!')
        }
        const cardToUpdate = await CardFacade.getById(cardId, { relations: ['members'] })

        cardToUpdate.members = cardToUpdate.members.filter(member => member.id !== userToUnassign.id)

        await getRepository(Card).save(cardToUpdate)
    }
    
    // --------------- Labels ---------------

    static async assignLabel(requester: Requester, cardId: number, params: {}): Promise<Tag> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const extractor = new ParamsExtractor<Card>(params).require(['labelId'])

        const labelToAssign = await TagFacade.getById(extractor.getParam('labelId'))
        const cardToUpdate = await CardFacade.getById(cardId, { relations: ['tags'] })

        cardToUpdate.tags = cardToUpdate.tags.concat(labelToAssign)
        
        await getRepository(Card).save(cardToUpdate)
        return labelToAssign
    }

    static async unassignLabelById(requester: Requester, cardId: number, labelId: number): Promise<void> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const labelToUnassign = await TagFacade.getById(labelId)
        const cardToUpdate = await CardFacade.getById(cardId, { relations: ['tags'] })

        cardToUpdate.tags = cardToUpdate.tags.filter(tag => tag.id !== labelToUnassign.id)

        await getRepository(Card).save(cardToUpdate)
    }

    // --------------- Comments ---------------

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
                    username: comment.user.username
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
