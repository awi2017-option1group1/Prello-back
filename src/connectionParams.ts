import { ConnectionOptions } from 'typeorm'

export const connectionOptions: ConnectionOptions[] = [
    {
        type: 'postgres',
        host: 'localhost',
        port: 5434,
        username: 'postgres',
        password: 'root',
        database: 'dev_prello',
        entities: [
            `${__dirname}/entities/*.js`
        ],
        synchronize: true,
        logging: true
    },
    {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [
            `${__dirname}/entities/*.js`
        ],
    }
]
