import { parse } from 'cookie'

import { config } from '../config'

import { RequesterFactory } from '../bl/requester'

export const getRequesterFromCookies = (cookieString: string) => {
    const cookies = parse(cookieString)
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
