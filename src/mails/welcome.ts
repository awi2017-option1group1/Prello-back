import { MailTemplate } from '../mail'

export const welcome = (name: string): MailTemplate => ({
    subject: 'Welcome to Prello by Photon',
    isHtml: false,
    body: `Hello ${name} and welcome to Prello by Photon.`
})
