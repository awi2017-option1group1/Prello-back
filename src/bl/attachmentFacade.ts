import { getManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { ParamsExtractor } from './paramsExtractor'
import { CardFacade } from './cardFacade'
import { Attachment } from './../entities/Attachment'

export class AttachmentFacade {

    static async delete(AttachmentId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(Attachment)
                    .removeById(AttachmentId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException('No Attachment was found')
        }
    }

    static async getAllFromCardId(cardId: number): Promise<Attachment[]> {
        try {
            const card = await CardFacade.getById(cardId)
            const attachments = card.attachments
            if (attachments) {
                return attachments
            } else {
                throw new NotFoundException('No Attachement was found')
            }
        } catch (e) {
            throw new NotFoundException(e)
        }
    }

    static async getById(attachementId: number): Promise<Attachment> {
        try {
            const attachment = await getManager()
                            .getRepository(Attachment)
                            .findOneById(attachementId)
            if (attachment) {
                return attachment
            } else {
                throw new NotFoundException('No Attachement was found')
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
