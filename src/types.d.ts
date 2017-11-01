///<reference path="./bl/requester.ts" />

declare namespace Express {
    export interface Request {
        requester: Requester
    }
}

declare namespace SocketIO {
    export interface Socket {
        requester: Requester
    }
}
