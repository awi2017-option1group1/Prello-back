import { websockets } from '../websockets/realtime'

export type AboutObject = 'board'

export interface RealTimeEvent {
    type: string,
    about: {
        object: AboutObject,
        id: number
    },
    /* tslint:disable */
    payload: any
    /* tslint:enable */
}

export class RealTimeFacade {

    static sendEvent(event: RealTimeEvent) {
        websockets.sendEventTo(event.about, {
            type: event.type,
            payload: event.payload
        })
    }

    static sendNotification() {
        // websockets.sendEvent()
    }

}
