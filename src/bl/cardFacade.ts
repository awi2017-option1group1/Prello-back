import { getManager } from 'typeorm'

import { CardNotFoundException } from './errors/CardNotFoundException'
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
            throw new CardNotFoundException('No Card was found')
        }
    }

    static async getById(cardId: number): Promise<Card> {
        const card = await getManager()
                            .getRepository(Card)
                            .findOneById(cardId)
        if (card) {
            return card
        } else {
            throw new CardNotFoundException('No Card was found')
        }
    }

    static async delete(cardId: number): Promise<boolean> {
        try {
            const cardToDelete = await CardFacade.getById(cardId)
            const deletionSuccess = await getManager()
                    .getRepository(Card)
                    .remove(cardToDelete)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new CardNotFoundException(e)
        }
    }

    static async update(cardReceived: Card, cardToUpdate: Card): Promise<Card> {
        try {
            const cardToSave = ParamsExtractor.extract<Card>(['title', 'description', 'dueDate', 'rank'],
                                                             cardReceived, cardToUpdate)
            const repository = getManager().getRepository(Card)
            return repository.save(cardToSave)
        } catch (e) {
            throw new CardNotFoundException(e)
        }
    }

    static async create(card: Card, listId: number): Promise<Card> {
        try {
            let cardToCreate = new Card()
            cardToCreate = ParamsExtractor.extract<Card>(['title', 'rank', 'description', 'dueDate'],
                                                         card, cardToCreate)
            return getManager().getRepository(Card).save(cardToCreate)
        } catch (e) {
            throw new CardNotFoundException(e)
        }
    }
}
