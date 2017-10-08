import * as express from 'express'
import _ from 'lodash'
export class ParamsExtractor {
    static extract(params: string[], req: express.Request): express.Request {
        for (var i = 0; i < req.params.length; i++) {
            _.includes(params, req.params[i])
        }
        return req
    }
}
