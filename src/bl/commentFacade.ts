import { getManager } from 'typeorm'
 
import { NotFoundException } from './errors/NotFoundException'
import { Comment } from '../entities/comment'
import { ParamsExtractor } from './paramsExtractor'
import { CardFacade } from './cardFacade'
import { UserFacade } from './userFacade'

export class CommentFacade {

    static async getAllFromCardId(cardId: number): Promise<Comment[]> {
        try {
            const card = await CardFacade.getById(cardId)
            const comments = card.comments
            if (comments) {
                return comments
            } else {
                throw new NotFoundException('No Comment was found')
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

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
    }

    static async getById(commentId: number): Promise<Comment> {
        try {
            const comment = await getManager()
                            .getRepository(Comment)
                            .findOneById(commentId)
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
            const deletionSuccess = await getManager()
                    .getRepository(Comment)
                    .removeById(commentId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async update(commentReceived: Comment): Promise<void> {
        try {
            const commentToSave = ParamsExtractor.extract<Comment>(['type', 'content', 'date'], 
                                                                   commentReceived)
            const repository = getManager().getRepository(Comment)
            return repository.updateById(commentReceived.id, commentToSave)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async create(comment: Comment, cardId: number): Promise<Comment> {
        try {
            let commentToCreate = new Comment()
            commentToCreate = ParamsExtractor.extract<Comment>(['type', 'content', 'date'],
                                                               comment)
            commentToCreate.card = await CardFacade.getById(cardId)
            return getManager().getRepository(Comment).save(commentToCreate)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }
}
