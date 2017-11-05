import { createConnection } from 'typeorm'

import { fromConfig } from './database'

import { app } from './app'
import { websockets } from './websockets/realtime'

createConnection(fromConfig())
.then(async connection => {
    const server = app.listen(app.get('port'), () => {
        console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
        console.log('Press CTRL-C to stop\n')
    })
    websockets.initialize(server)
})
.catch(error => console.log(error))
