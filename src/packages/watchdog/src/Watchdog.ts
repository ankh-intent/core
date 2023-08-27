import { WatchMatcher } from '@intent/utils';

import { UnitInterface } from './Unit';
import { WatchItem } from './WatchItem';

export interface WatchdogConfig {
    root: string;
    ignore: RegExp;
    aggregation: number;
}

export class Watchdog<U extends UnitInterface> {
    private uid: number = 0;
    private readonly config: WatchdogConfig;
    private readonly watches: { [index: number]: WatchItem<U> };

    public active: boolean;

    public constructor(config: WatchdogConfig) {
        this.watches = {};
        this.config = config;
        this.active = false;
    }

    public all(): WatchItem<U>[] {
        return Object.values(this.watches);
    }

    public start(items?: WatchItem<U>[]) {
        this.active = true;

        for (const item of items || this.all()) {
            item.watch(this.config);
        }
    }

    public stop() {
        if (!this.active) {
            return;
        }

        for (const item of this.all()) {
            item.detach();
        }
    }

    public watch(matcher: WatchMatcher): WatchItem<U> {
        const item = new WatchItem(++this.uid, matcher);

        item.once(WatchItem.DETACH, () => {
            delete this.watches[item.uid];
        });

        if (this.config.aggregation) {
            item.debounce(this.config.aggregation);
        }

        return this.watches[item.uid] = item;
    }

    public watchAll(pattern: string | RegExp, events: string[]): WatchItem<U>[] {
        return events.map((event) => this.watch({
            event,
            pattern,
        }));
    }
}
