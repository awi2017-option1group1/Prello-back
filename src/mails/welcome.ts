import { MailTemplate } from '../mail'

export const welcome = (name: string, userID: number, uuidToken: string): MailTemplate => ({
    subject: 'Welcome to Prello by Photon',
    isHtml: false,
    body: `Hello ${name} and welcome to Prello by Photon.
    to confirm your account, please click on this link : 
    https://photon.igpolytech.fr/users/${userID}/validate/${uuidToken}`
})
