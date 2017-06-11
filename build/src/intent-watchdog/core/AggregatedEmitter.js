"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter_1 = require("../../intent-utils/Emitter");
const Aggregator_1 = require("./aggregator/Aggregator");
class AggregatedEmitter extends Emitter_1.Emitter {
    constructor(delay) {
        super();
        this.aggregator = new Aggregator_1.Aggregator(delay);
        this.aggregator
            .debounce()
            .and(super.emit.bind(this));
    }
    emit(items) {
        return this.aggregator.aggregate(items), 0;
    }
    off(uid) {
        if (!uid) {
            this.aggregator.stop();
            this.aggregator = null;
        }
        return super.off(uid);
    }
}
exports.AggregatedEmitter = AggregatedEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWdncmVnYXRlZEVtaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZW50LXdhdGNoZG9nL2NvcmUvQWdncmVnYXRlZEVtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx3REFBcUQ7QUFDckQsd0RBQXFEO0FBRXJELHVCQUE4RCxTQUFRLGlCQUFVO0lBRzlFLFlBQW1CLEtBQWE7UUFDOUIsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBTyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsVUFBVTthQUNaLFFBQVEsRUFBRTthQUNWLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUM1QjtJQUNILENBQUM7SUFFTSxJQUFJLENBQUMsS0FBVTtRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxHQUFHLENBQUMsR0FBWTtRQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBQ0Y7QUF6QkQsOENBeUJDIn0=