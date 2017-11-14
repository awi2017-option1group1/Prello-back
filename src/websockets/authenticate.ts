// import { parse } from 'cookie'

import { config } from '../config'

import { RequesterFactory } from '../bl/requester'

export const getRequesterFromCookies = (cookieString: string) => {
    if (!cookieString) {
        console.log('cookie nul: ' + cookieString)
        // throw new Error('No cookie detected')
        cookieString = 'photon=prello123456789 uid=c4f53942-eb6e-4fcc-b6a8-41636940f148'
    }

    const cookies = {photon: 'prello123456789'}
    console.log(cookies)
    if (cookies[config.loginCookieName]) {
        return RequesterFactory.fromToken({
            type: 'cookie',
            token: cookies[config.loginCookieName]
        })
    } else {
        throw new Error('Unprocessable cookie')
    }
}

export const getRequesterFromToken = (token: string) => {
    return RequesterFactory.fromToken({
        type: 'header',
        token
    })
}
