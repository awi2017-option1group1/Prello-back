import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { BadRequest } from './errors/BadRequest'
import { ParamsExtractor } from './paramsExtractorv2'

import { Comment } from '../entities/comment'
import { CardFacade } from './cardFacade'
import { UserFacade } from './userFacade'
import { Requester } from './requester'

export class CommentFacade {

    static async getById(commentId: number): Promise<Comment> {
        const comment = await getRepository(Comment)
                                .createQueryBuilder('comment')
                                .leftJoinAndSelect('comment.card', 'card')
                                .leftJoinAndSelect('comment.user', 'user')
                                .where('comment.id = :commentId', { commentId })
                                .getOne()
        if (comment) {
            return comment
        } else {
            throw new NotFoundException('Comment not found')
        }
    }

    static async insertFromCardId(requester: Requester, cardId: number, params: {}): Promise<Comment> {
        try {
            const extractor = new ParamsExtractor<Comment>(params).require(['content'])
            const commentToInsert = extractor.fill(new Comment())

            commentToInsert.createdDate = new Date()
            commentToInsert.updatedDate = commentToInsert.createdDate
            commentToInsert.user = await UserFacade.getById(requester.getUID())
            commentToInsert.card = await CardFacade.getById(cardId)
            
            // RealTimeFacade.sendEvent(commentCreated(commentToReturn, boardId))
            
            const comment = await getRepository(Comment).save(commentToInsert)
            return comment
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async update(commentId: number, params: {}): Promise<Comment> {
        try {
            const extractor = new ParamsExtractor<Comment>(params).require(['content'])

            const commentToUpdate = await CommentFacade.getById(commentId)
            extractor.fill(commentToUpdate)
            
            commentToUpdate.updatedDate = new Date()

            // RealTimeFacade.sendEvent(commentUpdated(comment, boardId))
            
            const comment = await getRepository(Comment).save(commentToUpdate)
            return comment
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async delete(commentId: number): Promise<void> {
        try {
            // const comment = await CommentFacade.getById(commentId)
            // RealTimeFacade.sendEvent(commentDeleted(comment, cardId))

            await getRepository(Comment).removeById(commentId)
            return
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

}
