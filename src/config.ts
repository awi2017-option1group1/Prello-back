import { ConnectionOptions } from 'typeorm'
import { SmtpOptions } from 'nodemailer-smtp-transport'

export interface ServerConfig {
    host: string
    port: number
    apiSuffix: string
    authSuffix: string
}

export interface RedisConfig {
    url: string
    host: string
    port: number
}

export interface SocketConfig {
    path: string
}

export interface Config {
    env: 'development' | 'production' | 'test'

    loginCookieName: string
    internalToken: string

    server: ServerConfig
    database: ConnectionOptions
    databaseTest: ConnectionOptions
    redis: RedisConfig
    websocket: SocketConfig
    smtp: SmtpOptions
}

export const config: Config = {
    env: process.env.NODE_ENV || 'development',

    loginCookieName: process.env.LOGIN_COOKIE_NAME || 'photon',
    internalToken: process.env.INTERNAL_TOKEN || 'prello123456789',

    server: {
        host: process.env.SERVER_HOST || 'http://localhost',
        port: process.env.PORT || 5000,
        apiSuffix: process.env.API_SUFFIX || 'api',
        authSuffix: process.env.AUTH_SUFFIX || 'auth'
    },

    database: {
        type: process.env.DATABASE_TYPE || 'postgres',
        ssl: process.env.DATABASE_SSL === 'true',
        url: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/dev_prello'
    },

    databaseTest: {
        type: process.env.DATABASE_TYPE,
        ssl: process.env.DATABASE_SSL === 'true',
        url: process.env.TEST_DATABASE_URL
    },

    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        url: process.env.REDIS_URL
    },

    websocket: {
        path: process.env.WEBSOCKET_PATH || '/realtime' 
    },
    
    smtp: {
        service: 'Gmail',
        auth: {
            type: 'oauth2',
            user: process.env.SMTP_USER || 'porquepix1@gmail.com',
            clientId: process.env.SMTP_CLIENT_ID 
                || '327141825309-e1uo4fm1s4p7tvkh10lge4r9it9a5abd.apps.googleusercontent.com',
            clientSecret: process.env.SMTP_CLIENT_SECRET || '81c20_6f5WxCMeJvleB_vvis',
            refreshToken: process.env.SMTP_REFRESH_TOKEN 
                || '1/fEBoKO4_zM1Olo-OKmk0Epag4buSn71u0J5s50kB6CYWatiUlZ-4hy9Jl2nFK6NS'
        }
    }
}
