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
import { Tag } from './routes/tag/tag'
import { Comment } from './routes/comment/comment'
import { CheckItem } from './routes/checkItem/checkItem'
import { CheckList } from './routes/checkList/checkList'
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
app.post('/users/:userId/:confirmationToken', User.confirm)

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
app.get('/lists/:listId/cards', Card.getAllFromListId)
app.post('/lists/:listId/cards', Card.insertFromListId)
app.get('/cards/:cardId', Card.getOneById)
app.put('/cards/:cardId', Card.update)
app.delete('/cards/:cardId', Card.delete)

app.get('/cards/:cardId/labels', Card.getAllLabels)  
app.post('/cards/:cardId/labels', Card.assignLabel) 
app.delete('/cards/:cardId/labels/:labelId', Card.unassignLabelById)  

app.get('/cards/:cardId/members', Card.getAllMembers)
app.post('/cards/:cardId/members', Card.assignMember)
app.delete('/cards/:cardId/members/:memberId', Card.unassignMemberById)

// ---------    Tags Routes   --------- 
app.get('/boards/:boardId/labels', Tag.getAllFromBoardId)
app.post('/boards/:boardId/labels', Tag.insertFromBoardId) 
app.put('/labels/:labelId', Tag.update) 
app.delete('/labels/:labelId', Tag.delete) 

// ---------    CheckList Routes   ---------
app.get('/cards/:cardId/checklists', CheckList.getAllFromCardId)
app.post('/cards/:cardId/checklists', CheckList.insertFromCardId)
app.put('/checklists/:checklistId', CheckList.update)
app.delete('/checklists/:checklistId', CheckList.delete)

// ---------    CheckItem Routes   ---------
app.get('/checklists/:checklistId/checkitems', CheckItem.getAllFromChecklistId)
app.post('/checklists/:checklistId/checkitems', CheckItem.insertFromChecklistId)
app.put('/checkitems/:checkitemId', CheckItem.update)
app.delete('/checkitems/:checkitemId', CheckItem.delete)

// ---------    Comment Routes   ---------
app.get('/cards/:cardId/comments', Comment.getAllFromCardId)
app.post('/cards/:cardId/comments', Comment.create)
app.put('/comments/:commentId', Comment.update)
app.delete('/comments/:commentId', Comment.delete)

// ---------    Tags Routes   ---------
app.get('/boards/:boardId/labels', Tag.getAllFromBoardId)
app.post('/boards/:boardId/labels', Tag.insertFromBoardId)
app.put('/labels/:labelId', Tag.update)
app.delete('/labels/:labelId', Tag.delete)
