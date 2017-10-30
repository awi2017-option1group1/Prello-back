import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { config } from './config'
// import { RequesterFactory } from './bl/requester'

import { Register } from './routes/user/register'
import { User } from './routes/user/user'
import { Board } from './routes/board/board'
import { Card } from './routes/card/card'
import { Task } from './routes/task/task'
import { Attachment } from './routes/attachment/attachment'
import { TaskList } from './routes/taskList/taskList'
import { List } from './routes/list/list'

import { websockets } from './websockets/realtime'

export const app = express()

app.set('port', config.server.port)
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
    res.json({ healthcheck: 'ok' })
})

app.post('/notify', (req, res) => {
    websockets.sendEvent({
        type: 'notification',
        to: req.body.userId,
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
app.put('/users/:user_id', User.update)
app.delete('/users/:user_id', User.delete)

// ---------    List Routes   ---------
app.get('/boards/:boardId/lists', List.getAllFromBoardId)
app.post('/boards/:boardId/lists', List.insertFromBoardId)
app.put('/lists/:listId', List.update)
app.delete('/lists/:listId', List.delete)

// ---------    Board Routes   ---------
app.get('/boards/:boardId', Board.getOneById)
app.get('/users/:user_id/boards', Board.getAllFromUserId)
app.get('/teams/:team_id/boards', Board.getAllFromTeamId)
app.put('/boards', Board.update)
app.delete('/boards/:board_id', Board.delete)
app.post('/boards', Board.create)

// ---------    Card Routes   ---------
app.get('/cards/:id', Card.getOneById)  
app.get('/cards/:id/attachments', Card.getAllAttachments)  
app.get('/cards/:id/checklists', Card.getAllChecklists)  
app.get('/cards/:id/labels', Card.getAllLabels)  
app.get('/cards/:id/members', Card.getAllMembers)  

app.put('/cards/:id', Card.update)  

app.post('/cards/:id/attachments', Card.createAttachment)   
app.post('/cards/:id/checklists', Card.createChecklist)  
app.post('/cards/:id/labels', Card.assignLabel)  
app.post('/cards/:id/members', Card.assignMember)  

app.delete('/cards/:id', Card.delete)
app.delete('/cards/:id/labels/:idLabel', Card.unassignLabelById) 
app.delete('/cards/:id/members/:idMember', Card.unassignMemberById) 

// ---------    Task Routes   ---------
app.get('checkitems/:id', Task.getOneById)
app.put('/checkitems/:id', Task.update)
app.delete('/checkitems/:id', Task.delete)

// ---------    Attachment Routes   --------- 
app.delete('/attachment/:id', Attachment.delete) 

// ---------    TaskList Routes   ---------
app.get('/checklists/:id', TaskList.getOneById) 
app.get('/checklists/:id/checkItems', TaskList.getAllCheckItems)

app.put('/checklists/:id', TaskList.update)
app.post('/checklists/:id/checkItems', TaskList.createCheckItem)
app.delete('/checklists/:id', TaskList.delete)
