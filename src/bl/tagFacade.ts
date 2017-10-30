import { getManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Tag } from '../entities/tag'
import { ParamsExtractor } from './paramsExtractor'
import { BoardFacade } from './boardFacade'
import { CardFacade } from './cardFacade'

export class TagFacade {

    static async getAllFromBoardId(boardId: number): Promise<Tag[]> {
        const board = await BoardFacade.getById(boardId)
        const tags = board.tags
        if (tags) {
            return tags
        } else {
            throw new NotFoundException('No Tag was found')
        }
    }

    static async getAllFromCardId(cardId: number): Promise<Tag[]> {
        const card = await CardFacade.getById(cardId)
        const tags = card.tags
        if (tags) {
            return tags
        } else {
            throw new NotFoundException('No Tag was found')
        }
    }

    static async getById(tagId: number): Promise<Tag> {
        const tag = await getManager()
                            .getRepository(Tag)
                            .findOneById(tagId)
        if (tag) {
            return tag
        } else {
            throw new NotFoundException('No Tag was found')
        }
    }

    static async delete(tagId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(Tag)
                    .removeById(tagId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(tagReceived: Tag): Promise<void> {
        try {
            const tagToSave = ParamsExtractor.extract<Tag>(['id', 'name', 'color'], tagReceived)
            const repository = getManager().getRepository(Tag)
            return repository.updateById(tagReceived.id, tagToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(tag: Tag, boardId: number): Promise<Tag> {
        try {
            let tagToCreate = ParamsExtractor.extract<Tag>(['name', 'color'], tag)
            tagToCreate.board = await BoardFacade.getById(boardId)
            return getManager().getRepository(Tag).save(tagToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
