export class Eventable {
    private static _e_uid: number = 0;
    private _e_listeners?: { [event: string]: { [uid: string]: Function } };

    on(event: string, handler: Function): number {
        if (!this._e_listeners) {
            this._e_listeners = {};
        }

        const listeners = this._e_listeners[event] || (this._e_listeners[event] = {});
        const uid = ++(<typeof Eventable>this.constructor)._e_uid;
        listeners[uid] = handler;

        return uid;
    }

    once(event: string, handler: Function): number {
        let uid: number;

        return uid = this.on(event, (...args: any[]) => {
            this.off(event, uid);

            return handler(...args);
        });
    }

    off(event?: string, uid?: number) {
        if (!event) {
            this._e_listeners = undefined;

            return;
        }

        if (this._e_listeners) {
            const listeners = this._e_listeners[event];

            if (listeners) {
                if (!uid) {
                    delete this._e_listeners[event];
                } else {
                    delete listeners[uid];
                }
            }
        }
    }

    emit(event: string, ...payload: any[]): number {
        let handled = 0;

        const listeners = this._e_listeners?.[event];

        if (listeners) {
            for (const uid of Object.keys(listeners)) {
                listeners[uid](...payload, event);

                handled++;
            }
        }

        return handled;
    }
}
