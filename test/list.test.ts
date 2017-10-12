//const list = require('./list')
//import { List } from './../src/routes/list/list'
import { List } from './../src/entities/list'

/*
describe('#getUser() using async/await', () => {
    it('getOneById', async () => {
      const data = await github.getUser('vnglst')
      expect(data).toBeDefined()
      expect(data.entity.name).toEqual('Koen van Gilst')
    })
  })
  */

const list : List = new List()
list.id = 1
list.title = "Titre 1"
list.rank = 0

test('Function GET BY ID', () => {
    //expect(list.getOneById()).toBe(3);
})
