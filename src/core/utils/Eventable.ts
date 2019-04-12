
export class Eventable {
	private static _e_uid: number = 0;
	private _e_listeners: {[event: string]: {[index: number]: Function}};

	on(event: string, handler: Function): number {
		if (!this._e_listeners) {
			this._e_listeners = {};
		}

		let listeners = this._e_listeners[event] || (this._e_listeners[event] = {});
		let uid = ++(<typeof Eventable>this.constructor)._e_uid;
		listeners[uid] = handler;

		return uid;
	}

	once(event: string, handler: Function): number {
		let uid;

		return uid = this.on(event, (...args) => {
			this.off(event, uid);

			return handler(...args);
		});
	}

	off(event?: string, uid?: number) {
		if (!event) {
			this._e_listeners = null;

			return;
		}

		let listeners = this._e_listeners[event];

		if (listeners) {
			if (!uid) {
				delete this._e_listeners[event]
			} else {
				delete listeners[uid];
			}
		}
	}

	emit(event: string, ...payload: any[]): number {
		let handled = 0;

		if (this._e_listeners) {
			let listeners = this._e_listeners[event];

			if (listeners) {
				let uids = Object.keys(listeners);

				for (let uid of uids) {
					listeners[uid](...payload, event);

					handled++;
				}
			}
		}

		return handled;
	}
}
