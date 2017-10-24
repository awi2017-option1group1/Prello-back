import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { getConnectionManager, ConnectionManager } from 'typeorm'

import { config } from './config'
import { fromConfig } from './database'
// import { RequesterFactory } from './bl/requester'

import { User } from './routes/user/user'
import { Board } from './routes/board/board'
import { Card } from './routes/card/card'
import { Task } from './routes/task/task'
import { Attachment } from './routes/attachment/attachment'
import { TaskList } from './routes/taskList/taskList'
import { List } from './routes/list/list'

const app = express()

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

app.get('/protected', (req, res) => {
    if (req.requester.hasUID(1)) {
        res.send('Secret')
    } else {
        res.status(401)
    }
    res.end()
})

// ---------    User Routes   ---------
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
app.get('checkitems/:id', Task.getOneById) // ToDo
app.put('/checkitems/:id', Task.update) // ToDo
app.delete('/checkitems/:id', Task.delete) // ToDo

// ---------    Attachment Routes   --------- 
app.delete('/attachment/:id', Attachment.delete) 

// ---------    TaskList Routes   ---------
app.get('/checklists/:id', TaskList.getOneById) // ToDo
app.get('/checklists/:id/checkItems', TaskList.getAllCheckItems) // ToDo

app.put('/checklists/:id', TaskList.update) // ToDo
app.post('/checklists/:id/checkItems', TaskList.createCheckItem) // ToDo
app.delete('/checklists/:id', TaskList.delete) // ToDo

// ---------    Connection   ---------
const connectionManager: ConnectionManager = getConnectionManager()
connectionManager.create(fromConfig()).connect().then(connection => {
    app.listen(app.get('port'), () => {
      console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.log('Press CTRL-C to stop\n')
    })
}).catch(error => console.log(error))
