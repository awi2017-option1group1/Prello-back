import * as express from 'express'

import { config } from './config'

import { RequesterFactory, RequesterToken } from './bl/requester'

type NullableRequesterToken = RequesterToken | null

const getAuthorizationToken = (req: express.Request): NullableRequesterToken => {
    const authHeader = req.get('authorization')
    if (authHeader) {
        return {
            token: authHeader.substring('Bearer '.length),
            type: 'header'
        }
    } else {
        return null
    }
}

const getCookieToken = (req: express.Request): NullableRequesterToken => {
    const authCookie = req.cookies[config.loginCookieName]
    if (authCookie) {
        return {
            token: authCookie,
            type: 'cookie'
        }
    } else {
        return null
    }
}

const requesterMiddleware = () => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = getAuthorizationToken(req) || getCookieToken(req)
        if (token) {
            RequesterFactory.fromToken(token).then((requester) => {
                req.requester = requester
                next()
            })
        } else {
            req.requester = RequesterFactory.empty
            next()
        }
    }
}

export default requesterMiddleware
