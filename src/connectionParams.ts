import { ConnectionOptions } from 'typeorm'

export interface MultipleConnections {
    [key: string]: ConnectionOptions
}

export const connectionOptions: MultipleConnections = {
    'development': {
        driver: {
            type: 'postgres',
            host: 'localhost',
            port: 5434,
            username: 'postgres',
            password: 'root',
            database: 'dev_prello',
        },
        autoSchemaSync: true,
        entities: [
            `${__dirname}/entities/*.js` 
        ],
        logging: {
            logQueries: true
        }
    },
    'production': {
        driver: {
            type: 'postgres',
            url: process.env.DATABASE_URL
        },
        entities: [
            `${__dirname}/entities/*.js` 
        ],
    }
}
