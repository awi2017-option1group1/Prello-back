import { createTransport, SendMailOptions } from 'nodemailer'

import { config } from './config'

export const transporter = createTransport({
    ...config.smtp,
    logger: true,
    debug: true
})

export interface MailTemplate {
    subject: string
    body: string
    isHtml: boolean
}

/**
 * ex: sendMail('toto@yopmail.com', welcome('Toto'))
 * ex: sendMail('toto@yopmail.com, titi@yopmail.com', welcome('...'))
 */
export const sendMail = (
    to: string, 
    withContent: MailTemplate, 
    from: string = 'Prello by Photon <no-reply@photon.igpolytech.fr>'
) => {
    const options: SendMailOptions = withContent
    if (withContent.isHtml) {
        options.html = withContent.body
    } else {
        options.text = withContent.body
    }

    transporter.sendMail(
        {
            from,
            to,
            ...options
        },
        (error, info) => {
            if (error) {
                console.error(error)
            }
            console.log(info)
        }
    )
}
