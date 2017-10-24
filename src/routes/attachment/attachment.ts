import * as express from 'express'

import { AttachmentFacade } from '../../bl/AttachmentFacade'

export class Attachment {

    static async delete(req: express.Request, res: express.Response) {
        try {
            const deletionSuccess = await AttachmentFacade.delete(req.params.id)
            // req.params.id is the id of the Attachment
            if (deletionSuccess) {
                res.status(200).json(deletionSuccess)
            } else {
                res.status(404).json({ message : 'Not found'})
            }
        } catch (e) {
            res.status(404).json({ message: e.message})
        }
    }

}
