/*
import { List } from './../src/entities/list'
import { ListFacade } from './../src/bl/listFacade'
import { getEntityManager } from 'typeorm'

test('Get List by id : Should return the good list', done => {
  
  function t(data) {
    
    const listToBeCompared = new List()
    listToBeCompared.id= 3
    listToBeCompared.title = "list1"
    listToBeCompared.rank = 1
    expect(data).toEqual(listToBeCompared)
  }
  
  ListFacade.getById(3).then((l: List) => {
    t(l)
  })
})
*/
