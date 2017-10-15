export class ParamsExtractor {

        static extract<Entity>(params: string[], objectReceived: Entity, objectToUpdate: Entity) {
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
