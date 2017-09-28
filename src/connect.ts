import { createConnection } from 'typeorm'
import { User } from './entities/user'

createConnection().then(connection => {
    const userRepository  = connection.getRepository(User)
    // userRepository.create()
  }).catch(error => console.log(error))