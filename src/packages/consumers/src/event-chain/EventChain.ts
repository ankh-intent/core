import { Emitter, CoreEvent, EventChainInterface } from '@intent/kernel';

export type EventChainMonitoringConsumer = (data: EventChainInterface) => any;

export class EventChain<E extends CoreEvent> extends Emitter<EventChainMonitoringConsumer> {
    private readonly start: Date = new Date();
    private readonly accumulated: E[] = [];
    private readonly original: E[];
    private monitored: E[] = [];

    public constructor(original: E[]) {
        super();
        this.original = original;
    }

    public isRelated(event: E) {
        if (this.accumulated.indexOf(event) >= 0) {
            return true;
        }

        for (const original of this.original) {
            if (event.hasParent(original)) {
                return true;
            }
        }

        return false;
    }

    public isOpened(event: E) {
        return this.monitored.indexOf(event) >= 0;
    }

    public open(event: E) {
        if (this.accumulated.indexOf(event) >= 0) {
            return;
        }

        this.accumulated.push(event);
        this.monitored.push(event);

        for (const monitored of this.monitored) {
            if ((event !== monitored) && event.hasParent(monitored)) {
                if (this.close(monitored)) {
                    break;
                }
            }
        }
    }

    public close(event: E): boolean {
        this.monitored = this.monitored.filter((e) => e !== event);
        const open = this.monitored.length;

        if (open) {
            return false;
        }

        setTimeout(() => {
            this.emit({
                original: this.original,
                accumulated: this.accumulated,
                start: this.start,
                end: new Date(),
            });
        }, 100);

        return true;
    }
}
