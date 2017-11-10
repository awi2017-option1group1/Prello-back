import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { MissingParameterException } from './errors/MissingParameterException'
import { Comment } from '../entities/comment'
// import { ParamsExtractor } from './paramsExtractorv2'
import { CardFacade } from './cardFacade'
import { UserFacade } from './userFacade'

import { RealTimeFacade } from './realtimeFacade'
import { commentCreated, commentDeleted } from './realtime/realtimeComment'

export class CommentFacade {

    /*
    static async getAllFromUserId(userId: number): Promise<Comment[]> {
        try {
            const user = await UserFacade.getById(userId)
            const comments = user.comments
            if (comments) {
                return comments
            } else {
                throw new NotFoundException('No Comment was found')
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }*/

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

    /*
    static async update(commentReceived: Comment): Promise<void> {
        try {
            const commentToSave = ParamsExtractor.extract<Comment>(['content', 'createdDate'], 
                                                                    commentReceived)
            const repository = getManager().getRepository(Comment)
            return repository.updateById(commentReceived.id, commentToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }*/

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
