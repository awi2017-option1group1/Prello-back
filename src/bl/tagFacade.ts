import { getRepository } from 'typeorm'

import { BadRequest } from './errors/BadRequest'
import { NotFoundException } from './errors/NotFoundException'
import { ParamsExtractor } from './paramsExtractorv2'

import { BoardFacade } from './boardFacade'
import { CardFacade } from './cardFacade'

import { Tag, randomColor } from '../entities/tag'

export class TagFacade {

    static async getAllFromBoardId(boardId: number): Promise<Tag[]> {
        const board = await BoardFacade.getById(boardId, { relations: [ 'tags'] })
        return board.tags
    }

    static async getAllFromCardId(cardId: number): Promise<Tag[]> {
        const card = await CardFacade.getById(cardId, { relations: [ 'tags'] })
        return card.tags
    }

    static async search(boardId: number, search: string): Promise<Tag[]> {
        const tags = await getRepository(Tag)
            .createQueryBuilder('tag')
            .leftJoin('tag.board', 'board')
            .where('board.id = :boardId', { boardId })
            .where('tag.name LIKE :search', { search: `%${search}%` })
            .limit(10)
            .getMany()
        return tags
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

    static async create(boardId: number, params: {}): Promise<Tag> {
        try {
            const extractor = new ParamsExtractor<Tag>(params).permit(['name', 'color'])
            const tagToInsert = extractor.fill(new Tag())

            if (!extractor.hasParam('name')) {
                tagToInsert.name = 'EmptyTag'
            }

            if (!extractor.hasParam('color')) {
                tagToInsert.color = randomColor()
            }

            tagToInsert.board = await BoardFacade.getById(boardId)

            const tag = await getRepository(Tag).save(tagToInsert)
            delete tag.board

            return tag
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(tagId: number, params: {}): Promise<Tag> {
        try {
            const extractor = new ParamsExtractor<Tag>(params).permit(['name', 'color'])

            const tagToUpdate = await TagFacade.getById(tagId)
            extractor.fill(tagToUpdate)

            const tag = await getRepository(Tag).save(tagToUpdate)
            return tag
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(tagId: number): Promise<void> {
        try {
           await getRepository(Tag).removeById(tagId)
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

}
