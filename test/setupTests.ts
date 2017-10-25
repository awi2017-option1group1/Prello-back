process.env.NODE_ENV = 'test'

import { createConnection } from 'typeorm'

import { config } from '../src/config'
import { fromConfig } from '../src/database'

const dbConfig = {
    ...fromConfig(),
    migrations: [
        `${__dirname}/dist/migrations/*.js`
    ]
} 

// Reset the database before each test session
createConnection(fromConfig())
.then(async connection => {
    await connection.dropDatabase()
    await connection.runMigrations()
    await connection.close()
})
.catch(console.error)
