import { getEntityManager } from 'typeorm'

import { CardNotFoundException } from './errors/CardNotFoundException'
import { Card } from '../entities/card'
import { ParamsExtractor } from './paramsExtractor'

export class CardFacade {

    static async getAll(): Promise<Card[]>  {
        const cards = await getEntityManager()
                            .getRepository(Card)
                            .find()
        if (cards) {
            return cards
        } else {
            throw new CardNotFoundException('No Card was found')
        }
    }

    static async getAllFromListId(listId: number): Promise<Card[]> {
        const cards = await getEntityManager()
                            .getRepository(Card)
                            .find({
                                    list: listId
                            })
        if (cards) {
            return cards
        } else {
            throw new CardNotFoundException('No Card was found')
        }
    }

    static async getById(cardId: number): Promise<Card> {
        const card = await getEntityManager()
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
            const deletedCard = await getEntityManager()
                    .getRepository(Card)
                    .remove(cardToDelete)
            if (deletedCard) {
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
            const cardToSave = ParamsExtractor.extractCard(['title', 'description', 'dueDate', 'rank'],
                                                           cardReceived, cardToUpdate)
            const repository = getEntityManager().getRepository(Card)
            return repository.persist(cardToSave)
        } catch (e) {
            throw new CardNotFoundException(e)
        }
    }

    static async create(card: Card, listId: number): Promise<Card> {
        try {
            let cardToCreate = new Card()
            cardToCreate = ParamsExtractor.extractCard(['title', 'rank', 'description', 'dueDate'], card, cardToCreate)
            return getEntityManager().getRepository(Card).persist(cardToCreate)
        } catch (e) {
            throw new CardNotFoundException(e)
        }
    }
}
