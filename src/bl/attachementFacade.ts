import { getEntityManager } from 'typeorm'

import { NotFoundException } from './errors/NotFoundException'
import { Attachement } from '../entities/attachement'
import { ParamsExtractor } from './paramsExtractor'

export class AttachementFacade {

    static async getAllFromCardId(cardId: number): Promise<Attachement[]> {
        const attachements = await getEntityManager()
                            .getRepository(Attachement)
                            .find({
                                    card: cardId
                            })
        if (attachements) {
            return attachements
        } else {
            throw new NotFoundException('No Attachement was found')
        }
    }

    static async getById(attachementId: number): Promise<Attachement> {
        const attachement = await getEntityManager()
                            .getRepository(Attachement)
                            .findOneById(attachementId)
        if (attachement) {
            return attachement
        } else {
            throw new NotFoundException('No Attachement was found')
        }
    }

    static async delete(attachementId: number): Promise<boolean> {
        try {
            const attachementToDelete = await AttachementFacade.getById(attachementId)
            const deletedAttachement = await getEntityManager()
                    .getRepository(Attachement)
                    .remove(attachementToDelete)
            if (deletedAttachement) {
                return true
            } else {
                return false
            }
        } catch (e) {
            throw new NotFoundException('No Attachement was found')
        }
    }

    static async create(attachement: Attachement, cardId: number): Promise<Attachement> {
        try {
            let attachementToCreate = new Attachement()
            attachementToCreate = ParamsExtractor.extract<Attachement>(['type', 'URL', 'card'],
                                                                       attachement, attachementToCreate)
            return getEntityManager().getRepository(Attachement).persist(attachementToCreate)
        } catch (e) {
            throw new NotFoundException('No Attachement was found')
        }
    }
}
