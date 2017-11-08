import { getManager } from 'typeorm'
import { getRepository } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { ParamsExtractor } from './paramsExtractor'
import { CardFacade } from './cardFacade'
import { Attachment } from './../entities/attachment'

export class AttachmentFacade {

    static async delete(attachmentId: number): Promise<void> {
        try {
            await getRepository(Attachment).removeById(attachmentId)
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async getAllFromCardId(cardId: number): Promise<Attachment[]> {
        return await getRepository(Attachment)
        .createQueryBuilder('attachment')
        .leftJoin('attachment.card', 'card')
        .where('card.id = :cardId', { cardId })
        .getMany()
    }

    static async getById(attachementId: number): Promise<Attachment> {
        try {
            const attachment = await getManager()
                            .getRepository(Attachment)
                            .findOneById(attachementId)
            if (attachment) {
                return attachment
            } else {
                throw new NotFoundException('Attachement not found')
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async createByCardId(attachement: Attachment, cardId: number): Promise<Attachment> {
        try {
            let attachmentToCreate = ParamsExtractor.extract<Attachment>(
                ['URL', 'pos', 'name', 'date'], attachement)
            attachmentToCreate.card = await CardFacade.getById(cardId)
            return getManager().getRepository(Attachment).create(attachmentToCreate)
        } catch (e) {
            throw new NotFoundException('No Attachement was found')
        }
    }
}
