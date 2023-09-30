import { LogTypeName } from '@intent/utils';
import { CoreEvent, CoreEventConsumer, CoreStat } from '../interfaces';
import { ErrorEvent } from './events';
import { CoreEventBus } from './CoreEventBus';

export abstract class AbstractConsumer<E extends CoreEvent<T>, T> implements CoreEventConsumer<T, E> {
    protected readonly bus: CoreEventBus;

    public abstract supports(event: CoreEvent): boolean;

    public abstract process(event: E): CoreEvent | void;

    public constructor(bus: CoreEventBus) {
        this.bus = bus;
    }

    public detach(): boolean {
        return !!this.bus.off(this);
    }

    public consume(event: E): CoreEvent | void {
        if (!this.supports(event)) {
            return event;
        }

        try {
            return this.process(event);
        } catch (error) {
            return new ErrorEvent({ error }, event);
        }
    }

    public emit(event: CoreEvent, propagated?: boolean): CoreEvent {
        if (propagated !== undefined) {
            event.stopPropagation(!propagated);
        }

        return this.bus.emit(event);
    }

    public stat<T, S>(parent: CoreEvent | null, data: CoreStat<T, S>): CoreEvent {
        return this.bus.stat(parent, data);
    }

    public log(parent: CoreEvent | null, message: Partial<Record<LogTypeName, any>>): CoreEvent {
        return this.bus.log(parent, message);
    }
}
