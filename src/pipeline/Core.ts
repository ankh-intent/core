import { PluginRegistry, Plugin } from '@intent/plugins';
import { Emitter, Logger, UnitMatcher } from '@intent/utils';
import { RecursiveFinder } from '@intent/source';
import {
    CoreLogger,
    TreeNode,
    Identifiable,
    CoreEvent,
    CoreEventBus,
    EventChainInterface,
    FatalEvent,
    ReadyEvent,
    StopEvent,
    UpdateEvent,
} from '@intent/kernel';
import { ErrorConsumer, StatConsumer, EventChainMonitor } from '@intent/consumers';
import { CoreConfig } from '@intent/config';

import { PipelineObserverFactory } from './PipelineObserver';

type CoreEventEmitter<T> = (event: CoreEvent<T>) => any;

export interface ConfigFactory<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
    (core: Core<C, N, T>, config: CoreConfig): C;
}

export class Core<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> extends Emitter<CoreEventEmitter<any>> {
    private readonly eventChainMonitor: EventChainMonitor<CoreEvent>;

    public readonly events: CoreEventBus;
    public readonly plugins: PluginRegistry;
    public readonly logger: Logger;

    public constructor() {
        super();
        this.logger = new CoreLogger();
        this.events = new CoreEventBus();
        this.plugins = new PluginRegistry();
        this.eventChainMonitor = new EventChainMonitor(this.events);
    }

    public registerPlugin(plugin: Plugin) {
        this.plugins.register(plugin);
    }

    public bootstrap(config: CoreConfig, configFactory: ConfigFactory<C, N, T>, observerFactory: PipelineObserverFactory<C, N, T>): C {
        const resolved = configFactory(this, config);
        const observer = observerFactory(this, resolved);

        this.events
            .reset()
            .add(this.eventChainMonitor);

        observer.bootstrap(this, resolved);

        this.events
            .add(new ErrorConsumer(this.events, this.logger, resolved.emit.verbose))
            .add(new StatConsumer(this.events, this.logger, [resolved.paths.project, resolved.paths.internal]))
            .add(this.eventChainMonitor)
            .add({
                consume: (event) => {
                    this.emit(event);

                    if (event instanceof FatalEvent) {
                        this.stop();
                    }
                },
            })
        ;

        return resolved;
    }

    public start(config: C): this {
        const updates: CoreEvent[] = [];

        for (const [name, entry] of Object.entries(config.entry)) {
            updates.push(
                ...this
                    .matched(entry.path, entry.test)
                    .map((path) => new UpdateEvent({ event: 'change', path, entry: name })),
            );
        }

        this.eventChainMonitor
            .monitor(updates)
            .once((data: EventChainInterface) => {
                this.events.emit(new ReadyEvent(data));
            })
        ;

        for (const update of updates) {
            this.events.emit(update);
        }

        return this;
    }

    public stop(cause?: CoreEvent) {
        this.events.emit(new StopEvent(cause));
    }

    protected matched(root: string, matchers: UnitMatcher[]) {
        const finder = new RecursiveFinder();
        const paths: string[] = [];

        for (const matcher of matchers) {
            const found = finder.find(root, matcher);

            if (found) {
                paths.push(found);
            }
        }


        return paths;
    }
}

