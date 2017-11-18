import { getManager, getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'
import { ParamsExtractor } from './paramsExtractorv2'

import { ListFacade } from './listFacade'
import { UserFacade } from './userFacade'
import { TagFacade } from './tagFacade'

import { User } from '../entities/user'
import { Tag } from '../entities/tag'
import { Card } from '../entities/card'

import { RealTimeFacade } from './realtimeFacade'
import { cardCreated, cardUpdated, cardDeleted } from './realtime/realtimeCard'

export class CardFacade {

    static async getAllFromListId(listId: number): Promise<Card[]> {
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

    static async insertFromListId(listId: number, params: {}): Promise<Card> {
        try {
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

    static async update(cardId: number, params: {}): Promise<Card> {
        try {
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

    static async delete(cardId: number): Promise<void> {
        try {
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

    static async getAllMembersFromCardId(cardId: number): Promise<User[]> {
        const users = await CardFacade.getById(cardId, { relations: ['members'] })
        return users.members
    }

    static async assignMember(cardId: number, params: {}): Promise<User> {
        const extractor = new ParamsExtractor<Card>(params).require(['userId'])

        const userToAssign = await UserFacade.getById(extractor.getParam('userId'))
        const cardToUpdate = await CardFacade.getById(cardId, { relations: ['members'] })

        cardToUpdate.members = cardToUpdate.members.concat(userToAssign)

        await getRepository(Card).save(cardToUpdate)
        return userToAssign
    }

    static async unassignMemberById(cardId: number, memberId: number): Promise<void> {
        const userToUnassign = await UserFacade.getById(memberId)
        const cardToUpdate = await CardFacade.getById(cardId, { relations: ['members'] })

        cardToUpdate.members = cardToUpdate.members.filter(member => member.id !== userToUnassign.id)

        await getRepository(Card).save(cardToUpdate)
    }
    
    // --------------- Labels ---------------

    static async getAllLabelsFromCardId(cardId: number): Promise<Tag[]> {
        const labels = await getManager()
                            .getRepository(Tag)
                            .find({
                                where: {
                                    'cardId': cardId
                                }
                            })
        if (labels) {
            return labels
        } else {
            throw new NotFoundException('No labels found')
        }
    }

    static async assignLabel(label: Tag, cardId: number): Promise<void> {
        const cardRepository = await getManager()
                            .getRepository(Card)

        var card = await cardRepository.findOneById(cardId)
        if (card) {
            const labels = await card.tags
            card.tags = labels.concat(label)
            return cardRepository.updateById(cardId, card)
        } else {
            throw new NotFoundException('No label was found')
        }
    }

    static async unassignLabelById(cardId: number, labelId: number): Promise<boolean> {
        const cardRepository = await getManager()
                                .getRepository(Card)

        var card = await cardRepository.findOneById(cardId)
        if (card) {
            const labels = await card.tags  
            if (labels) {
                const label = await TagFacade.getById(labelId)  // member get by memberId
                if (label) {
                    card.tags = labels.slice(
                                                        labels.indexOf(label), 
                                                        labels.indexOf(label) + 1)
                    const deletionSuccess =  cardRepository.save(card)
                    if (deletionSuccess) { 
                        return true 
                    } else { 
                        return false 
                    }
                } else {
                    throw new NotFoundException('No label was found with this id')
                }
            } else {
            throw new NotFoundException('No label was found with this id')
            }
        } else {
            throw new NotFoundException('No label was found with this id')
        }
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
