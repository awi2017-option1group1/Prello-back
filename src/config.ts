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
    env: process.env.NODE_ENV || 'development',

    server: {
        host: process.env.SERVER_HOST || 'http://localhost',
        port: process.env.PORT || 5000,
        apiSuffix: process.env.API_SUFFIX || 'api',
        authSuffix: process.env.AUTH_SUFFIX || 'auth'
    },

    database: {
        type: process.env.DATABASE_TYPE || 'postgres',
        ssl: process.env.DATABASE_SSL === 'true',
        url: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5434/dev_prello'
    },

    databaseTest: {
        type: process.env.DATABASE_TYPE,
        ssl: process.env.DATABASE_SSL === 'true',
        url: process.env.TEST_DATABASE_URL
    }
}
