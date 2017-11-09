import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser'

import { config } from './config'
import requester from './requesterMiddleware'

import { Register } from './routes/user/register'
import { User } from './routes/user/user'
import { Board } from './routes/board/board'
import { Card } from './routes/card/card'
import { Task } from './routes/task/task'
import { Attachement } from './routes/attachement/attachement'
import { TaskList } from './routes/taskList/taskList'
import { List } from './routes/list/list'

import { websockets } from './websockets/realtime'

export const app = express()

app.set('port', config.server.port)
app.use(compression())
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('*', requester())

app.get('/', (req, res) => {
    res.json({ healthcheck: 'ok' })
})

app.post('/notify', (req, res) => {
    websockets.sendEventTo({ object: 'user', id: req.body.userId }, {
        type: 'notification',
        payload: {
            title: 'Notification',
            message: 'This notification is sent via socket.io-redis'
        }
    })
    res.status(204).end()
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
app.post('/register', Register.register)
app.get('/users', User.getAll)
app.get('/users/:user_id', User.getOneById)
app.get('/teams/:team_id/users', User.getAllFromTeamId)
app.put('/users/:userId', User.update)
app.delete('/users/:user_id', User.delete)

// ---------    List Routes   ---------
app.get('/boards/:boardId/lists', List.getAllFromBoardId)
app.post('/boards/:boardId/lists', List.insertFromBoardId)
app.put('/lists/:listId', List.update)
app.delete('/lists/:listId', List.delete)

// ---------    Board Routes   ---------
app.get('/boards/:boardId', Board.getOneById)
app.get('/users/:userId/boards', Board.getAllFromUserId)
app.get('/teams/:teamId/boards', Board.getAllFromTeamId)
app.put('/boards/:boardId', Board.update)
app.delete('/boards/:boardId', Board.delete)
app.post('/users/:userId/boards', Board.create)

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
