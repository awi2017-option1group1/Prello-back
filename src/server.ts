import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { createConnection } from 'typeorm'
import  { connectionOptions } from './connectionParams'
import { Login } from './routes/user/login'
import { User } from './routes/user/user'
import { Board } from './routes/board/board'
import { Card } from './routes/card/card'
import { TaskList } from './routes/taskList/taskList'
import { RequesterFactory } from './bl/requester'

export const ENV = process.env.NODE_ENV || 'development'

const app = express()

app.set('port', process.env.PORT || 5000)
app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('*', (req, res, next) => {
    const auth = req.get('authorization')
    if (auth) {
        const token = auth.substring('Bearer '.length)
        RequesterFactory.fromJWT(token).then((requester) => {
            req.requester = requester
            next()
        })
    } else {
        req.requester = RequesterFactory.empty
        next()
    }
})

app.get('/', (req, res) => {
    return 'Hello World !'
})

app.get('/protected', (req, res) => {
    if (req.requester.hasUID(1)) {
        res.send('Secret')
    } else {
        res.status(401)
    }
    res.end()
})

// ---------    User Routes   ---------
app.post('/login', Login.authenticate)
app.get('/users', User.getAll)
app.get('/users/:user_id', User.getOneById)
app.get('/teams/:team_id/users', User.getAllFromTeamId)
app.put('/users/:user_id', User.update)
app.delete('/users/:user_id', User.delete)
app.post('/users', User.create)

// ---------    Board Routes   ---------
app.get('/boards', Board.getAll)
app.get('/boards/:board_id', Board.getOneById)
app.get('/users/:user_id/boards', Board.getAllFromUserId)
app.get('/teams/:team_id/boards', Board.getAllFromTeamId)
app.put('/boards', Board.update)
app.delete('/boards/:board_id', Board.delete)
app.post('/boards', Board.create)

// ---------    Card Routes   ---------
app.get('/cards', Card.getAll)
app.get('/cards/:card_id', Card.getOneById)
app.get('/boards/:board_id/lists/:list_id/cards', Card.getAllFromListId)
app.put('/cards', Card.update)
app.delete('/cards/:card_id', Card.delete)
app.post('/boards/:board_id/lists/:list_id/cards', Card.create)

// ---------    TaskList Routes   ---------
app.get('/cards/:card_id/taskLists/:taskList_id', TaskList.getAllFromCardId)
app.get('taskList/:taskList_id', TaskList.getOneById)
app.put('/taskList', TaskList.update)
app.delete('/taskList/:taskList_id', TaskList.delete)
app.post('/taskList/:taskList_id', TaskList.create)

createConnection(connectionOptions[ENV]).then(connection => {
    app.listen(app.get('port'), () => {
      console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.log('Press CTRL-C to stop\n')
    })
}).catch(error => console.log(error))
