"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar = require("chokidar");
const Eventable_1 = require("../../intent-utils/Eventable");
const Emitter_1 = require("../../intent-utils/Emitter");
const AggregatedEmitter_1 = require("./AggregatedEmitter");
class WatchItem extends Eventable_1.Eventable {
    constructor(uid, matcher) {
        super();
        this.uid = uid;
        this.matcher = matcher;
    }
    watch(options) {
        let { pattern, event } = this.matcher;
        let strict = !(pattern instanceof RegExp);
        let bound = this.event.bind(this, event);
        let handler = bound;
        if (!strict) {
            handler = (path, ...rest) => {
                if (!path.match(pattern)) {
                    return;
                }
                return bound(path, ...rest);
            };
        }
        this.watcher = chokidar
            .watch(strict ? pattern : options.root, {
            ignored: options.ignore,
            persistent: true,
        })
            .on(event, handler);
        return this;
    }
    detach() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
            this.emit(WatchItem.DETACH);
            this.off();
        }
        return this;
    }
    event(event, path, ...payload) {
        let data = { event, path, payload };
        this.emitter.emit([data]);
        this.emit(WatchItem.EVENT, data);
    }
    debounce(delay) {
        if ((delay !== this.debounced) && this._emitter) {
            this.emitter = null;
        }
        this.debounced = delay;
        return this;
    }
    get emitter() {
        if (!this._emitter) {
            if (this.debounced) {
                this._emitter = new AggregatedEmitter_1.AggregatedEmitter(this.debounced);
            }
            else {
                this._emitter = new Emitter_1.Emitter();
            }
        }
        return this._emitter;
    }
    set emitter(emitter) {
        if (this._emitter === emitter) {
            return;
        }
        if (this._emitter) {
            this._emitter.off();
        }
        this._emitter = emitter;
    }
}
WatchItem.EVENT = 'event';
WatchItem.DETACH = 'detach';
exports.WatchItem = WatchItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2F0Y2hJdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ludGVudC13YXRjaGRvZy9jb3JlL1dhdGNoSXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQUFxQztBQUVyQyw0REFBeUQ7QUFFekQsd0RBQXFEO0FBS3JELDJEQUF3RDtBQUV4RCxlQUFnRCxTQUFRLHFCQUFTO0lBVy9ELFlBQW1CLEdBQVcsRUFBRSxPQUFvQjtRQUNsRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUF3QjtRQUNuQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sWUFBWSxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXBCLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNaLE9BQU8sR0FBRyxDQUFDLElBQVksRUFBRSxHQUFHLElBQUk7Z0JBQzlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBUyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLE1BQU0sQ0FBQztnQkFDVCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDOUIsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUTthQUNwQixLQUFLLENB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