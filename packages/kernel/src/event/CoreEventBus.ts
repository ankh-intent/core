import { LogMethodName } from '@intent/utils';
import { CoreEventConsumer, CoreEvent, CoreStat } from '../interfaces';
import { StatEvent } from './events';

export class CoreEventBus {
    private consumers: CoreEventConsumer<any, any>[] = [];

    public add(consumer: CoreEventConsumer<any, any>): this {
        this.consumers.push(consumer);

        return this;
    }

    public reset(): this {
        this.consumers = [];

        return this;
    }

    public off(consumer: CoreEventConsumer<any, any>): number {
        let index: number;
        let n = 0;

        while ((index = this.consumers.indexOf(consumer)) >= 0) {
            delete this.consumers[index];
            n++;
        }

        return n;
    }

    public emit(event: CoreEvent): CoreEvent {
        for (const consumer of this.consumers) {
            const processed = consumer.consume(event);

            if (event === processed) {
                if (!event.bubble) {
                    break;
                }

                continue;
            }

            if (!processed) {
                break;
            }

            if (processed.bubble) {
                if (!processed.parent) {
                    processed.parent = event;
                }

                event = this.emit(processed);
            }

            break;
        }

        return event;
    }

    public stat<T, S>(parent: CoreEvent | null, data: CoreStat<T, S>): CoreEvent {
        return this.emit(new StatEvent(parent, data));
    }

    public log(parent: CoreEvent | null, message: Partial<Record<LogMethodName, any>>): CoreEvent {
        return this.emit(new StatEvent(parent, { type: 'log', message }));
    }
}
