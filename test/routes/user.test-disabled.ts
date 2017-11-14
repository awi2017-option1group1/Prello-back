import * as request from 'supertest'

import { Connection } from 'typeorm'
import { createTestingConnection, reloadTestingDatabase, closeTestingConnection } from '../utils'
import { entities } from '../../src/entities'

import { User } from '../../src/entities/user'

import { app } from '../../src/app'

describe('Test the User#gelAll route', () => {

    let connection: Connection
    beforeAll(async () => connection = await createTestingConnection({
        entities,
        synchronize: true,
        dropSchema: true
    }))
    beforeEach(() => reloadTestingDatabase(connection))
    afterAll(() => closeTestingConnection(connection))

    it('should response the GET ALL method', async (done) => {
        const user = new User()
        user.email = 'user#getall@test.fr'
        user.username = 'user#getall'
        user.notificationsEnabled = true
        user.confirmed = false
        user.password = 'toto'

        const expectedUser = await connection.getRepository(User).save(user)
        delete expectedUser.password

        request(app).get('/users')
        .expect(200)
        .then(response => {
            expect(response.body).toEqual([expectedUser])
            done()
        })
    })

    it('should response the POST register method (without password)', async (done) => {
        request(app).post('/register')
        .send({
            username: 'register',
            email: 'register@test.fr'
        })
        .expect(200)
        .then(response => {
            expect(response.body).toEqual([{'bio': null, 
                confirmed: false, 
                email: 'user#getall@test.fr', 
                fullName: null, 
                id: 1, 
                initial: null, 
                notificationsEnabled: true, 
                username: 'user#getall'
        }])
            done()
        })
    })

    it('should response the POST register method (with password)', async (done) => {
        request(app).post('/register')
        .send({
            username: 'register',
            email: 'register@test.fr',
            password: 'admin'
        })
        .expect(200)
        .then(response => {
            expect(response.body.username).toBe('register')
            expect(response.body.email).toBe('register@test.fr')
            expect(response.body.password).not.toBeNull()
            done()
        })
    })

    it('should response the POST register method (with error if no email provided)', async (done) => {
        request(app).post('/register')
        .send({
            username: 'register',
            password: 'admin'
        })
        .expect(400)
        .then(response => {
            done()
        })
    })
})
