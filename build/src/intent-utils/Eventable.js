"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Eventable {
    on(event, handler) {
        if (!this._e_listeners) {
            this._e_listeners = {};
        }
        let listeners = this._e_listeners[event] || (this._e_listeners[event] = {});
        let uid = ++this.constructor._e_uid;
        listeners[uid] = handler;
        return uid;
    }
    once(event, handler) {
        let uid;
        return uid = this.on(event, (...args) => {
            this.off(event, uid);
            return handler(...args);
        });
    }
    off(event, uid) {
        if (!event) {
            this._e_listeners = null;
            return;
        }
        let listeners = this._e_listeners[event];
        if (listeners) {
            if (!uid) {
                delete this._e_listeners[event];
            }
            else {
                delete listeners[uid];
            }
        }
    }
    emit(event, ...payload) {
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
Eventable._e_uid = 0;
exports.Eventable = Eventable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVudC11dGlscy9FdmVudGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQTtJQUlDLEVBQUUsQ0FBQyxLQUFhLEVBQUUsT0FBaUI7UUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDNUUsSUFBSSxHQUFHLEdBQUcsRUFBcUIsSUFBSSxDQUFDLFdBQVksQ0FBQyxNQUFNLENBQUM7UUFDeEQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUV6QixNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUVELElBQUksQ0FBQyxLQUFhLEVBQUUsT0FBaUI7UUFDcEMsSUFBSSxHQUFHLENBQUM7UUFFUixNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJO1lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRXJCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYyxFQUFFLEdBQVk7UUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1osSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFFekIsTUFBTSxDQUFDO1FBQ1IsQ0FBQztRQUVELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFekMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNmLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDVixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDaEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFhLEVBQUUsR0FBRyxPQUFjO1FBQ3BDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUVoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXpDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFbEMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUVsQyxPQUFPLEVBQUUsQ0FBQztnQkFDWCxDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2hCLENBQUM7O0FBN0RjLGdCQUFNLEdBQVcsQ0FBQyxDQUFDO0FBRG5DLDhCQStEQyJ9