import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'

import { createConnection } from 'typeorm'
import  { connectionOptions } from './connectionParams'
import { Login } from './routes/user/login'
import { Requester } from './bl/requester'
export const ENV = process.env.NODE_ENV || 'development'

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    const requester = Requester.fromJWT(req.headers.jwt)
    console.log('Requester : ', requester)
})

app.post('/login', Login.authenticate)

createConnection(connectionOptions[ENV]).then(connection => {
    app.listen(app.get('port'), () => {
      console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.log('Press CTRL-C to stop\n')
    })
}).catch(error => console.log(error))
