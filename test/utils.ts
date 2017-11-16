import { ConnectionOptions, Connection, createConnection } from 'typeorm'

import { config } from '../src/config'

import { User } from '../src/entities/user'
import { Requester, RequesterFactory } from '../src/bl/requester'

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

export const getRequester = async (connection: Connection): Promise<Requester> => {
    const user = new User()
    user.email = 'requester@requester.test'
    user.username = 'requester'
    user.notificationsEnabled = true
    user.confirmed = true
    const requester = await connection.getRepository(User).save(user)
    return RequesterFactory.fromUid(requester.id) 
}
