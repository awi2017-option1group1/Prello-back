import * as http from 'http'
import * as io from 'socket.io'
import * as redisAdapter from 'socket.io-redis'

import { config } from '../config'

export class SocketEvent {
    type: string
    to: string
    payload: {}
}

class WSToken {
    token: string
}

export class WSServer {

    private initialized: boolean
    private server: SocketIO.Server | null

    constructor() {
        this.initialized = false
        this.server = null

        this.onConnect = this.onConnect.bind(this)
        this.onAuthorize = this.onAuthorize.bind(this)
    }

    initialize(server: http.Server) {
        if (this.isInitialized()) {
            return
        }

        this.server = io(server, {
            path: config.websocket.path,
            origins: '*:*',
            transports: ['websocket'],
            adapter: redisAdapter({
                host: config.redis.host,
                port: config.redis.port
            })
        })

        /* tslint:disable */
        console.log(`Websocket server is running at ${server.address().address}:${server.address().port}${config.websocket.path}`)
        /* tslint:enable */

        this.server.on('connect', this.onConnect)

        this.initialized = true
    }

    sendEvent(event: SocketEvent) {
        if (!this.isInitialized()) {
            throw new Error('WSServer is not initialized')
        }

        this.server!.to(`user-${event.to}`).emit(event.type, event.payload)
    }

    private isInitialized() {
        return this.initialized
    }

    private onConnect(socket: SocketIO.Socket) {
        socket.emit('connected')
        socket.on('authorize', this.onAuthorize(socket))
    }

    private onAuthorize(socket: SocketIO.Socket) {
        return (token: WSToken) => {
            if (token.token === '1') {
                socket.emit('authorized')
                socket.join(`user-${token.token}`)
            } else {
                socket.emit('unauthorized')
            }          
        }
    }

}

export const websockets = new WSServer()
