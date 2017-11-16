import * as request from 'supertest'

import { Connection } from 'typeorm'
import { createTestingConnection, reloadTestingDatabase, closeTestingConnection, getRequester } from '../utils'
import { entities } from '../../src/entities'

import { User } from '../../src/entities/user'
import { UserFacade } from '../../src/bl/userFacade'

describe('UserFacade', () => {

    let connection: Connection
    beforeAll(async () => connection = await createTestingConnection({
        entities,
        synchronize: true,
        dropSchema: true
    }))
    beforeEach(() => reloadTestingDatabase(connection))
    afterAll(() => closeTestingConnection(connection))

    it('should return all the users', async (done) => {
        const user = new User()
        user.email = 'user#getall@test.fr'
        user.username = 'user#getall'
        user.notificationsEnabled = true
        user.confirmed = false
        user.password = 'toto'

        const expectedUser = await connection.getRepository(User).save(user)
        delete expectedUser.password

        expect(await UserFacade.getAll()).toEqual([expectedUser])
        done()
    })

    it('should register (without password)', async (done) => {
        const user = await UserFacade.register('register@test.fr', 'register', 'aaa')
        expect(user).toEqual({
            bio: null,
            confirmed: false,
            email: 'register@test.fr',
            username: 'register',
            fullName: null,
            id: 1,
            initial: null,
            notificationsEnabled: true,
            password: null,
            confirmationToken: 'aaa'
        })
        return done()
    })

    it('should register (with password)', async (done) => {
        const user = await UserFacade.register('register@test.fr', 'register', 'aaa', 'password')
        expect(user.password).not.toBeNull()
        expect(user.email).toBe('register@test.fr')
        expect(user.username).toBe('register')
        return done()
    })
    
    it('should return one user', async (done) => {
        const requester = await getRequester(connection)
        const user = await UserFacade.getById(requester, requester.getUID())
        expect(user.id).toBe(requester.getUID())
        return done()
    })

    it('should not return one user', async (done) => {
        const requester = await getRequester(connection)
        try {
            await UserFacade.getById(requester, requester.getUID() + 1)
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
        }
        return done()
    })

    it('should update one user', async (done) => {
        const requester = await getRequester(connection)

        let user = await UserFacade.update(requester, requester.getUID(), { bio: 'aaa' })
        expect(user.bio).toBe('aaa')

        user = await UserFacade.update(requester, requester.getUID(), { fullName: 'titi toto' })
        expect(user.fullName).toBe('titi toto')

        return done()
    })

    it('should not update one user', async (done) => {
        const requester = await getRequester(connection)
        try {
            await UserFacade.update(requester, requester.getUID() + 1, { bio: 'aaa' })
        } catch (e) {
            expect(e).not.toBeNull()
        }
        return done()
    })

    it('should delete one user', async (done) => {
        const requester = await getRequester(connection)
        await UserFacade.delete(requester, requester.getUID())
        return done()
    })

    it('should not delete one user', async (done) => {
        const requester = await getRequester(connection)
        try {
            await UserFacade.delete(requester, requester.getUID())
        } catch (e) {
            expect(e).not.toBeNull()
        }
        return done()
    })
})
