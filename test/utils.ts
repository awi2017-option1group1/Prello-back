import { ConnectionOptions, Connection, createConnection } from 'typeorm'

import { config } from '../src/config'

export const createTestingConnection = async (options: Partial<ConnectionOptions>): Promise<Connection> => {
    try {
        return await createConnection(Object.assign(
            {},
            config.databaseTest,
            options
        ))
    } catch (e) {
        console.error(e)
        throw new Error('Error to setup test')
    }
}

export const closeTestingConnection = async (connection: Connection) => {
    return await connection.isConnected ? connection.close() : undefined
}

export const reloadTestingDatabase = async (connection: Connection) => {
    return await connection.synchronize(true)
}
