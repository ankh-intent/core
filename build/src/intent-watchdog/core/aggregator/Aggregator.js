"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter_1 = require("../../../intent-utils/Emitter");
const Watch_1 = require("./Watch");
class Aggregator {
    constructor(delay = 200) {
        this.delay = delay;
        this.aggregated = [];
    }
    has() {
        return this.aggregated.length;
    }
    stop() {
        if (!this.debounced) {
            return;
        }
        let { watch, emitter } = this.debounced;
        this.debounced = null;
        watch.cancel();
        emitter.off();
    }
    debounce() {
        this.stop();
        let emitter = new Emitter_1.Emitter();
        let watch = new Watch_1.Watch(this.submit.bind(this, emitter));
        this.debounced = {
            emitter,
            watch,
        };
        if (this.has()) {
            watch.bounce(this.delay);
        }
        return emitter;
    }
    aggregate(items) {
        if (this.debounced) {
            this.debounced.watch.bounce(this.delay);
        }
        return this.aggregated.push(...items);
    }
    submit(emitter) {
        let aggregated = this.aggregated;
        this.aggregated = [];
        emitter.emit(aggregated);
    }
}
exports.Aggregator = Aggregator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWdncmVnYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9pbnRlbnQtd2F0Y2hkb2cvY29yZS9hZ2dyZWdhdG9yL0FnZ3JlZ2F0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyREFBd0Q7QUFFeEQsbUNBQWdDO0FBRWhDO0lBU0UsWUFBbUIsUUFBZ0IsR0FBRztRQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sR0FBRztRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNoQyxDQUFDO0lBRU0sSUFBSTtRQUNULEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUV0QixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWixJQUFJLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUssQ0FBQztRQUMvQixJQUFJLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsU0FBUyxHQUFHO1lBQ2YsT0FBTztZQUNQLEtBQUs7U0FDTixDQUFDO1FBRUYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNmLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxTQUFTLENBQUMsS0FBVTtRQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRVMsTUFBTSxDQUFDLE9BQW1CO1FBQ2xDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFckIsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQixDQUFDO0NBQ0Y7QUE5REQsZ0NBOERDIn0=