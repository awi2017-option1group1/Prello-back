import { getManager } from 'typeorm'

import { AttachementNotFoundException } from './errors/AttachementNotFoundException'
import { Attachement } from '../entities/attachement'
import { ParamsExtractor } from './paramsExtractor'
import { CardFacade } from './cardFacade'
export class AttachementFacade {

    static async getAllFromCardId(cardId: number): Promise<Attachement[]> {
        try {
            const card = await CardFacade.getById(cardId)
            const attachements = card.attachements
            if (attachements) {
                return attachements
            } else {
                throw new AttachementNotFoundException('No Attachement was found')
            }
        } catch (e) {
            throw new AttachementNotFoundException(e)
        }
    }

    static async getById(attachementId: number): Promise<Attachement> {
        try {
            const attachement = await getManager()
                            .getRepository(Attachement)
                            .findOneById(attachementId)
            if (attachement) {
                return attachement
            } else {
                throw new AttachementNotFoundException('No Attachement was found')
            }
        } catch (e) {
            throw new AttachementNotFoundException(e)
        }
    }

    static async delete(attachementId: number): Promise<boolean> {
        try {
            const deletionSuccess = await getManager()
                    .getRepository(Attachement)
                    .removeById(attachementId)
            if (deletionSuccess) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new AttachementNotFoundException(e)
        }
    }

    static async create(attachement: Attachement, cardId: number): Promise<Attachement> {
        try {
            let attachementToCreate = ParamsExtractor.extract<Attachement>(['type', 'URL'], attachement)
            attachementToCreate.card = await CardFacade.getById(cardId)
            return getManager().getRepository(Attachement).create(attachementToCreate)
        } catch (e) {
            throw new AttachementNotFoundException(e)
        }
    }
}
