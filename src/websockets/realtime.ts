// import { BoardFacade } from '../bl/boardFacade'
import * as http from 'http'
import * as io from 'socket.io'
import * as redisAdapter from 'socket.io-redis'

import { config } from '../config'

import { getRequesterFromCookies, getRequesterFromToken } from './authenticate'

export class SocketEvent {
    type: string
    payload: {}
}

interface WSToken {
    token: string
}

export interface Channel {
    object: string
    id: number
}

const getRedisConnection = (): SocketIORedis.RedisAdapter => {
    if (config.redis.url) {
        return redisAdapter(config.redis.url)
    } else {
        return redisAdapter({
            host: config.redis.host,
            port: config.redis.port
        })
    }
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
            adapter: getRedisConnection()
        })

        /* tslint:disable */
        console.log(`Websocket server is running at ${server.address().address}:${server.address().port}${config.websocket.path}`)
        /* tslint:enable */

        this.server.on('connect', this.onConnect)

        this.initialized = true
    }

    sendEventTo(channel: Channel, event: SocketEvent) {
        if (!this.isInitialized()) {
            throw new Error('WSServer is not initialized')
        }

        console.log('send event', event, channel)
        this.server!.to(this.channelToString(channel)).emit(event.type, event.payload)  
    }

    public disconnect(socket: SocketIO.Socket, reason?: string) {
        if (reason) {
            socket.emit(reason)
        }
        socket.disconnect()
    }

    private isInitialized() {
        return this.initialized
    }

    /**
     * Check the identity of the user who is connected.
     * 1. If the requester has a login cookie, try to authorize him
     * 1.1.   If the cookie is invalid, stop the connection
     * 1.2.   Else authorize him
     * 2. Else, wait until receiving an 'authorize' message with a valid token
     */
    private onConnect(socket: SocketIO.Socket) {
        socket.emit('connected')
        getRequesterFromCookies(socket.handshake.headers.cookie)
        .then(
            requester => {
                if (requester.isEmptyRequester()) {
                    this.disconnect(socket, 'unauthorized')
                } else {
                    socket.requester = requester
                    this.authorize(socket)
                }
            }
        )
        .catch(
            error => {
                socket.on('authorize', this.onAuthorize(socket))
            }
        )
    }

    private authorize(socket: SocketIO.Socket) {
        socket.emit('authorized')

        socket.join(this.channelToString({
            object: 'user',
            id: socket.requester.getUID()
        }))

        socket.on('request-connection', (to: Channel) => {
            if (to.object === 'board') {
                if (socket.requester.shouldHaveBoardAccess(to.id).toBoolean()) {
                    socket.join(this.channelToString(to))
                }
            }
        })

        socket.on('remove-connection', (to: Channel) => {
            socket.leave(this.channelToString(to))
        })
    }

    private onAuthorize(socket: SocketIO.Socket) {
        return (token: WSToken) => {
            getRequesterFromToken(token.token)
            .then(
                requester => {
                    if (requester.isEmptyRequester()) {
                        this.disconnect(socket, 'unauthorized')
                    } else {
                        socket.requester = requester
                        this.authorize(socket)
                    }
                }
            )        
        }
    }

    private channelToString(channel: Channel) {
        return `${channel.object}-${channel.id}`
    }

}

export const websockets = new WSServer()
