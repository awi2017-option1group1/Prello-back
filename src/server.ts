import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { createConnection } from 'typeorm'
import  { connectionOptions } from './connectionParams'
import { Login } from './routes/user/login'
import { Board } from './routes/board/board'
import { Requester } from './bl/requester'

export const ENV = process.env.NODE_ENV || 'development'

const app = express()

app.set('port', process.env.PORT || 5000)
app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    const requester = Requester.fromJWT(req.headers.jwt)
    console.log('Requester : ', requester)
})

app.post('/login', Login.authenticate)
app.get('/boards', Board.getAll)
app.get('/boards/:board_id', Board.getOneById)
app.get('/users/:user_id/boards', Board.getAllFromUserId)
app.get('/teams/:team_id/boards', Board.getAllFromTeamId)
app.put('/boards', Board.update)
app.delete('/boards/:board_id', Board.delete)
app.post('/boards', Board.create)

createConnection(connectionOptions[ENV]).then(connection => {
    app.listen(app.get('port'), () => {
      console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.log('Press CTRL-C to stop\n')
    })
}).catch(error => console.log(error))
