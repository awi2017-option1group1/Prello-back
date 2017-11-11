import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { MissingParameterException } from './errors/MissingParameterException'
import { BadRequest } from './errors/BadRequest'

import { Comment } from '../entities/comment'
import { ParamsExtractor } from './paramsExtractorv2'
import { CardFacade } from './cardFacade'
import { UserFacade } from './userFacade'

import { RealTimeFacade } from './realtimeFacade'
import { commentCreated, commentDeleted, commentUpdated } from './realtime/realtimeComment'

export class CommentFacade {

    static async getById(commentId: number): Promise<Comment> {
        try {
            const comment = await getRepository(Comment)
                                 .createQueryBuilder('comment')
                                 .leftJoinAndSelect('comment.card', 'card')
                                 .leftJoinAndSelect('comment.user', 'user')
                                 .where('comment.id = :commentId', { commentId })
                                 .getOne()
            if (comment) {
                return comment
            } else {
                throw new NotFoundException('No Comment was found')
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async getByIdWithBoard(commentId: number): Promise<Comment> {
        const comment = await getRepository(Comment)
                             .createQueryBuilder('comment')
                             .leftJoinAndSelect('comment.card', 'card')
                             .leftJoinAndSelect('card.list', 'list')
                             .leftJoinAndSelect('list.board', 'board')
                             .where('comment.id = :commentId', { commentId })
                             .getOne()
        if (comment) {
            return comment
        } else {
            throw new NotFoundException('Comment not found')
        }
    }

    static async delete(commentId: number): Promise<boolean> {
        try {
            const comment = await CommentFacade.getById(commentId)
            const cardId = comment.card.id
            delete comment.card
            
            await getRepository(Comment).removeById(commentId)

            RealTimeFacade.sendEvent(commentDeleted(comment, cardId))

            return true

        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    // When a comment is update, you can precise the new content.
    // NOTE: The createdDate will be updated automaticaly to the date of the update time.
    // userId, userName and cardId can NOT be changed !
    static async update(commentId: number, params: {}): Promise<Comment> {

        try {
            const extractor = new ParamsExtractor<Comment>(params).permit(['content'])
            // you can't update the author (userId & userName) or change it card
            
            const commentToUpdate = await CommentFacade.getByIdWithBoard(commentId)
            extractor.fill(commentToUpdate)
            
            // update the createdDate
            commentToUpdate.createdDate = new Date()
            
            // save value
            const comment = await getRepository(Comment).save(commentToUpdate)
            
            // get the boardId for real time before deletion
            const boardId = comment.card.list.board.id

            // Remove the properties from the comment object to not send it in the response
            delete comment.card
            delete comment.user
            RealTimeFacade.sendEvent(commentUpdated(comment, boardId))

            return comment
        } catch (e) {
            console.error(e)
            throw new BadRequest(e)
        }
    }

    static async create(params: {}, cardId: number): Promise<Comment> {
        try {
            
            let commentToCreate = new Comment()
            let userId

            // extract params
            const properties = ['content', 'createdDate', 'userId']
            properties.forEach(name => {
                if (name === 'userId') {
                    userId = params[name]
                } else if (params.hasOwnProperty(name)) {
                    commentToCreate[name] = params[name]
                }
            })
            // we don't want the user to be able to send his own date
            commentToCreate.createdDate = new Date()

            // add into user
            if (userId !== undefined) {
                commentToCreate.user = await UserFacade.getById(userId)
                UserFacade.addComment(commentToCreate, userId)
            } else {
                throw new MissingParameterException('userId (author) missing')
            }
            // add into card
            commentToCreate.card = await CardFacade.getById(cardId)
            CardFacade.addComment(commentToCreate, cardId)
            const boardId = commentToCreate.card.list.board.id

            // save comment
            const commentToReturn = await getRepository(Comment).save(commentToCreate)

            RealTimeFacade.sendEvent(commentCreated(commentToReturn, boardId))

            return Promise.resolve(commentToReturn)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
