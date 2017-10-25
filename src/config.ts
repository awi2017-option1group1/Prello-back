import { ConnectionOptions } from 'typeorm'

export interface ServerConfig {
    host: string
    port: number
    apiSuffix: string
    authSuffix: string
}

export interface Config {
    env: 'development' | 'production' | 'test'

    server: ServerConfig
    database: ConnectionOptions
    databaseTest: ConnectionOptions
}

export const config: Config = {
    env: process.env.NODE_ENV,

    server: {
        host: process.env.HOST,
        port: process.env.PORT,
        apiSuffix: process.env.API_SUFFIX,
        authSuffix: process.env.AUTH_SUFFIX
    },

    database: {
        type: process.env.DATABASE_TYPE,
        url: process.env.DATABASE_URL
    },

    databaseTest: {
        type: process.env.DATABASE_TYPE,
        url: process.env.TEST_DATABASE_URL
    }
}
