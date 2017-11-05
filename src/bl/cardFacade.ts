import { getManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Card } from '../entities/card'
import { ParamsExtractor } from './paramsExtractor'
import { ListFacade } from './listFacade'

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

    static async update(cardReceived: Card): Promise<void> {
        try {
            const cardToSave = ParamsExtractor.extract<Card>(['title', 'description', 'dueDate', 'rank'], cardReceived)
            const repository = getManager().getRepository(Card)
            return repository.updateById(cardReceived.id, cardToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(card: Card, listId: number): Promise<Card> {
        try {
            let cardToCreate = ParamsExtractor.extract<Card>(['title', 'rank', 'description', 'dueDate'], card)
            cardToCreate.list = await ListFacade.getById(listId)
            return getManager().getRepository(Card).save(cardToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
