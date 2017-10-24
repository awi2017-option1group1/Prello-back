import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { getConnectionManager, ConnectionManager } from 'typeorm'
import { connectionOptions } from './connectionParams'
import { Login } from './routes/user/login'
import { User } from './routes/user/user'
import { Board } from './routes/board/board'
import { Card } from './routes/card/card'
import { Task } from './routes/task/task'
import { Attachement } from './routes/attachement/attachement'
import { TaskList } from './routes/taskList/taskList'
// import { RequesterFactory } from './bl/requester'
import { List } from './routes/list/list'

export const ENV = process.env.NODE_ENV || 'development'

const app = express()

app.set('port', process.env.PORT || 5000)
app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
/*
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
})*/

app.get('/', (req, res) => {
    res.send('Hello world')
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

// ---------    List Routes   ---------
app.get('/boards/:board_id/lists', List.getAllFromBoardId)
app.get('/boards/:board_id/lists/:list_id', List.getOneById)
app.post('/boards/:board_id/lists', List.insertFromBoardId)
app.put('/boards/:board_id/lists/:list_id', List.update)
app.delete('/boards/:board_id/lists/:list_id', List.delete)

// ---------    Board Routes   ---------
app.get('/boards/:board_id', Board.getOneById)
app.get('/boards/:board_id/labels', Board.getBoardLabels)
app.get('/boards/:board_id/ists', Board.getBoardLists)
app.get('/boards/:board_id/members', Board.getBoardMembers)
// app.get('/boards/:board_id/cards/:filter', Board.filterCards)
// app.get('/boards/:board_id/lists/:filter', Board.filterLists)

app.put('/boards/:board_id', Board.update)
// app.put('/boards/:board_id/members', Board.updateBoardMembers)
// app.put('/boards/:board_id/member/:member_id', Board.updateBoardMember)

app.post('/boards', Board.create)
app.post('/boards/:board_id/labels', Board.addLabel)
app.post('/boards/:board_id/lists', Board.addList)

app.delete('/boards/:board_id', Board.delete)
app.delete('/boards/:board_id/members/:id_member', Board.delete)

// ---------    Card Routes   ---------
app.get('/cards/:card_id', Card.getOneById)
app.get('/boards/:board_id/lists/:list_id/cards', Card.getAllFromListId)
app.put('/cards', Card.update)
app.delete('/cards/:card_id', Card.delete)
app.post('/boards/:board_id/lists/:list_id/cards', Card.create)

// ---------    Task Routes   ---------
app.get('/taskList/:taskList_id/lists', Task.getAllFromTaskListId)
app.get('task/:task_id', Task.getOneById)
app.put('/task', Task.update)
app.delete('/task/:task_id', Task.delete)
app.post('/tasks', Task.create)

// ---------    Attachement Routes   ---------
app.get('/card/:card_id/attachements', Attachement.getAllFromCardId)
app.get('attachement/:attachement_id', Attachement.getOneById)
app.delete('/attachement/:attachement_id', Attachement.delete)
app.post('/attachements', Task.create)
app.post('/task/:task_id', Task.create)

// ---------    TaskList Routes   ---------
app.get('/cards/:card_id/taskLists/:taskList_id', TaskList.getAllFromCardId)
app.get('taskList/:taskList_id', TaskList.getOneById)
app.put('/taskList', TaskList.update)
app.delete('/taskList/:taskList_id', TaskList.delete)
app.post('/taskList/:taskList_id', TaskList.create)

const connectionManager: ConnectionManager = getConnectionManager()
connectionManager.create(connectionOptions[ENV]).connect().then(connection => {
    app.listen(app.get('port'), () => {
      console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.log('Press CTRL-C to stop\n')
    })
}).catch(error => console.log(error))
