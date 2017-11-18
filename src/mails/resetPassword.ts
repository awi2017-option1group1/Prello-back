import { MailTemplate } from '../mail'

export const resetPassword = (name: string, userID: number, uuidToken: string): MailTemplate => ({
    subject: 'Welcome to Prello by Photon',
    isHtml: false,
    body: `Hello ${name}.
    Somebody(Hopefully you) requested a password reset on your account.
    to reset your password, please click on this link : 
    https://photon.igpolytech.fr/users/${userID}/reset/${uuidToken}
    
    This link will be valid for 10 minutes.`
})
