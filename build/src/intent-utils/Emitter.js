"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Eventable_1 = require("./Eventable");
class Emitter {
    constructor() {
        this.eventable = new Eventable_1.Eventable();
    }
    emit(...args) {
        return this.eventable.emit(Emitter.EMIT, ...args);
    }
    and(handler) {
        return this.eventable.on(Emitter.EMIT, (...args) => {
            args.pop(); // remove event from top
            return handler(...args);
        });
    }
    once(handler) {
        return this.eventable.once(Emitter.EMIT, (...args) => {
            args.pop();
            return handler(...args);
        });
    }
    off(uid) {
        return this.eventable.off(Emitter.EMIT, uid);
    }
}
Emitter.EMIT = 'emit';
exports.Emitter = Emitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbnRlbnQtdXRpbHMvRW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDJDQUF3QztBQUV4QztJQUFBO1FBR1UsY0FBUyxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO0lBeUJ0QyxDQUFDO0lBdkJRLElBQUksQ0FBQyxHQUFHLElBQUk7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sR0FBRyxDQUFDLE9BQVU7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUk7WUFDN0MsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsd0JBQXdCO1lBRXBDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxJQUFJLENBQUMsT0FBVTtRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSTtZQUMvQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFWCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQVk7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7QUExQmMsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUQvQiwwQkE0QkMifQ==