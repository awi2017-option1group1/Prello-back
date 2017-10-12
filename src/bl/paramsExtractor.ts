import { Board } from '../entities/board'
import { Card } from '../entities/card'

export class ParamsExtractor {

    static extractBoard(params: string[], objectReceived: Board, objectToUpdate: Board) {
        var keyNames = Object.keys(objectReceived)
        for (var i = 0; i < keyNames.length; i++) {
            for (var j in params) {
                if (keyNames[i] === params[j]) {
                    objectToUpdate[keyNames[i]] = objectReceived[keyNames[i]]
                }
            }
        }

        return objectToUpdate
    }

    static extractCard(params: string[], objectReceived: Card, objectToUpdate: Card) {
        var keyNames = Object.keys(objectReceived)
        for (var i = 0; i < keyNames.length; i++) {
            for (var j in params) {
                if (keyNames[i] === params[j]) {
                    objectToUpdate[keyNames[i]] = objectReceived[keyNames[i]]
                }
            }
        }

        return objectToUpdate
    }
}
