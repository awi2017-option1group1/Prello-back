import * as request from 'supertest'

import { app } from '../../../src/app'

describe('Test the User#gelAll route', () => {
    test('It should response the GET method', () => {
        return request(app).get('/users').expect(200)
    })
})
