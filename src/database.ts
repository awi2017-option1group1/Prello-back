import { ConnectionOptions } from 'typeorm'

import { config } from './config'

const getDatabaseConfig = () => {
    if (config.env === 'test') {
        return config.databaseTest
    } else {
        return config.database
    }  
}

export const fromConfig = (): ConnectionOptions => ({
    ...getDatabaseConfig(),
    synchronize: false,
    entities: [
        `${__dirname}/entities/*.js`
    ],
    logging: ['query', 'error']
})
