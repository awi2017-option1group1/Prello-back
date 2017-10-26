import { getManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { ParamsExtractor } from './paramsExtractor'

import { ListFacade } from './listFacade'
import { UserFacade } from './userFacade'
import { TagFacade } from './tagFacade'

import { User } from '../entities/user'
import { Tag } from '../entities/tag'
import { Card } from '../entities/card'

export class CardFacade {

    static async getAllFromListId(listId: number): Promise<Card[]> {
        const list = await ListFacade.getById(listId)
        const cards = list.cards
        if (cards) {
            return cards
        } else {
            throw new NotFoundException('No Card was found')
        }
    }

    static async getById(cardId: number): Promise<Card> {
        const card = await getManager()
                            .getRepository(Card)
                            .findOneById(cardId)
        if (card) {
            return card
        } else {
            throw new NotFoundException('No Card was found')
        }
    }

    static async delete(cardId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(Card)
                    .removeById(cardId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(cardReceived: Card, cardId: number): Promise<void> {
        try {
            const cardToSave = ParamsExtractor.extract<Card>(
                ['name', 'closed', 'desc', 'due', 'dueComplete', 'pos'], cardReceived)
            const repository = getManager().getRepository(Card)
            return repository.updateById(cardId, cardToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(card: Card, listId: number): Promise<Card> {
        try {
            let cardToCreate = ParamsExtractor.extract<Card>(
                ['name', 'closed', 'desc', 'due', 'dueComplete', 'pos'], card)
            cardToCreate.list = await ListFacade.getById(listId)
            return getManager().getRepository(Card).save(cardToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    // --------------- Members ---------------

    static async getAllMembersFromCardId(cardId: number): Promise<User[]> {
        const users = await getManager()
                            .getRepository(User)
                            .find({
                                where: {
                                    'cardId': cardId
                                }
                            })
        if (users) {
            return users
        } else {
            throw new NotFoundException('No User was found')
        }
    }

    static async assignMember(user: User, cardId: number): Promise<void> {
        const repository = await getManager()
                            .getRepository(Card)

        var card = await repository.findOneById(cardId)
        if (card) {
            const members = await card.members
            if (members) {
                card.members = Promise.resolve(members.concat(user))
                return repository.updateById(cardId, card)
            } else {
                throw new NotFoundException('No Board was found')
            }
        } else {
            throw new NotFoundException('No Board was found')
        }
}

    static async unassignMemberById(cardId: number, memberId: number): Promise<boolean> {
        const repository = await getManager()
                                .getRepository(Card)

        var card = await repository.findOneById(cardId)
        if (card) {
            const members = await card.members  // members is the list of all members assigned to the card
            if (members) {
                const member = await UserFacade.getById(memberId)  // member get by memberId
                if (member) {
                    card.members = Promise.resolve(members.slice(
                                                        members.indexOf(member), 
                                                        members.indexOf(member) + 1))

                    const deletionSuccess =  repository.save(card)
                    if (deletionSuccess ) { 
                        return true 
                    } else { 
                        return false 
                    }
                } else {
                    throw new NotFoundException('No Member was found for this card')
                }
            } else {
            throw new NotFoundException('No Member was found for this card')
            }
        } else {
            throw new NotFoundException('No Member was found for this card')
        }
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
        const repository = await getManager()
                            .getRepository(Card)

        var card = await repository.findOneById(cardId)
        if (card) {
            const labels = await card.tags
            if (labels) {
                card.tags = Promise.resolve(labels.concat(label))
                return repository.updateById(cardId, card)
            } else {
                throw new NotFoundException('No label was found')
            }
        } else {
            throw new NotFoundException('No label was found')
        }
    }

    static async unassignLabelById(cardId: number, labelId: number): Promise<boolean> {
        const repository = await getManager()
                                .getRepository(Card)

        var card = await repository.findOneById(cardId)
        if (card) {
            const labels = await card.tags  
            if (labels) {
                const label = await TagFacade.getById(labelId)  // member get by memberId
                if (label) {
                    card.tags = Promise.resolve(labels.slice(
                                                        labels.indexOf(label), 
                                                        labels.indexOf(label) + 1))
                    const deletionSuccess =  repository.save(card)
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
}
