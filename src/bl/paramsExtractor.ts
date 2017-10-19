export class ParamsExtractor {

        static extract<Entity>(params: string[], objectReceived: Entity) {
            var objectToReturn = <Entity> {}
            var keyNames = Object.keys(objectReceived)
            for (var i = 0; i < keyNames.length; i++) {
                for (var j in params) {
                    if (keyNames[i] === params[j]) {
                        objectToReturn[keyNames[i]] = objectReceived[keyNames[i]]
                    }
                }
            }

            return objectToReturn
        }
    }
