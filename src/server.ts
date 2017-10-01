import { createConnection } from 'typeorm';
import * as express from 'express';
import * as compression from 'compression'; // compresses requests
import * as bodyParser from 'body-parser';
import { User } from './entities/user';
const app = express();
createConnection().then(connection => {
  // Do something

    app.set('port', process.env.PORT || 3000);
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.get('/', (req, res) => {
      res.end('Hello World!');
    })

    app.listen(app.get('port'), () => {
      console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
      console.log('Press CTRL-C to stop\n');
    });

  console.log(connection)
}).catch(error => console.log(error))

  module.exports = app;

