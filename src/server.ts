import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import { createConnection } from 'typeorm'

import  { connectionOptions } from './connectionParams'

export const ENV = process.env.NODE_ENV || 'development'

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.end('Hello World!')
})

createConnection(connectionOptions[ENV]).then(connection => {
    app.listen(app.get('port'), () => {
      console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
      console.log('Press CTRL-C to stop\n')
    })
}).catch(error => console.log(error))
