import { ConnectionOptions } from 'typeorm'

export interface MultipleConnections {
    [key: string]: ConnectionOptions
}

export const connectionOptions: MultipleConnections = {
    'development': {
        name: 'development',
        type: 'postgres',
        host: 'localhost',
        port: 5434,
        username: 'postgres',
        password: 'root',
        database: 'dev_prello',
        entities: [
            `${__dirname}/entities/*.js`
        ],
        logging: true
    },
    'production': {
        name: 'production',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [
            `${__dirname}/entities/*.js`
        ],
    }
}
