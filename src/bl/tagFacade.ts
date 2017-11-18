import { getRepository } from 'typeorm'

import { BadRequest } from './errors/BadRequest'
import { NotFoundException } from './errors/NotFoundException'
import { ParamsExtractor } from './paramsExtractorv2'

import { Requester } from './requester'
import { BoardFacade } from './boardFacade'
import { CardFacade } from './cardFacade'
import { Board } from '../entities/board'

import { Tag, randomColor } from '../entities/tag'

export class TagFacade {

    static async getAllFromBoardId(requester: Requester, boardId: number): Promise<Tag[]> {
        const board = await BoardFacade.getById(requester, boardId, { relations: [ 'tags'] })
        return board.tags
    }

    static async getAllFromCardId(requester: Requester, cardId: number): Promise<Tag[]> {
        (await requester.shouldHaveCardAccess(cardId)).orElseThrowError()

        const card = await CardFacade.getById(cardId, { relations: [ 'tags'] })
        return card.tags
    }

    static async getById(tagId: number, options?: {}): Promise<Tag> {
        const tag = await getRepository(Tag).findOne({
            ...options,
            where: {
                id: tagId
            }
        })
        if (tag) {
            return tag
        } else {
            throw new NotFoundException('Tag not found')
        }
    }

    static async create(requester: Requester, boardId: number, params: {}): Promise<Tag> {
        try {
            (await requester.shouldHaveBoardAccess(boardId)).orElseThrowError()

            const extractor = new ParamsExtractor<Tag>(params).permit(['name', 'color'])
            const tagToInsert = extractor.fill(new Tag())

            if (!extractor.hasParam('name')) {
                tagToInsert.name = 'EmptyTag'
            }

            if (!extractor.hasParam('color')) {
                tagToInsert.color = randomColor()
            }

            const board = await getRepository(Board).findOneById(boardId)
            if (!board) {
                throw new NotFoundException('Board not found')
            }
            tagToInsert.board = board

            const tag = await getRepository(Tag).save(tagToInsert)
            delete tag.board

            return tag
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(requester: Requester, tagId: number, params: {}): Promise<Tag> {
        try {
            const extractor = new ParamsExtractor<Tag>(params).permit(['name', 'color'])
            
            const tagToUpdate = await TagFacade.getById(tagId, { relations: ['board'] })
            extractor.fill(tagToUpdate)
            
            const hasAccess = await requester.shouldHaveBoardAccess(tagToUpdate.board.id)
            hasAccess.orElseThrowError()

            const tag = await getRepository(Tag).save(tagToUpdate)
            return tag
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(requester: Requester, tagId: number): Promise<void> {
        try {
            const tagToDelete = await TagFacade.getById(tagId, { relations: ['board'] })

            const hasAccess = await requester.shouldHaveBoardAccess(tagToDelete.board.id)
            hasAccess.orElseThrowError()

            await getRepository(Tag).removeById(tagId)
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

}
