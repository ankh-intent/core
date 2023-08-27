import { UnitInterface, Watchdog, WatchdogConfig } from '@intent/watchdog';
import {
    Container,
    CoreConfig,
    DummyWriter,
    FileWriter,
    BaseTokenTypes,
    TokensFactory,
    TreeNode,
    Identifiable,
    DependencyManager,
    ReadyEvent,
    StopEvent,
    RootBuilder,
    EmitResolver,
    CoreEvent,
} from '@intent/kernel';
import {
    IdentifiableFactory,
    PatchAfterParse,
    EmitAfterInterpreting,
    ParseAfterRead,
    ReadAfterUpdate,
    WatchAfterReadyStage,
    RunPlugins,
} from '@intent/consumers';

import { Core } from './Core';
import { PipelineObserver } from './PipelineObserver';

export interface TranspilerConfig extends CoreConfig {
    watch?: WatchdogConfig;
}

export abstract class WatchedTranspilerPipelineObserver<
    N extends TreeNode,
    T extends Identifiable<N>,
    C extends TranspilerConfig = TranspilerConfig,
    TT extends BaseTokenTypes = BaseTokenTypes,
>
    implements PipelineObserver<C, N, T>, IdentifiableFactory<N, T>
{
    protected readonly dependencyTree: DependencyManager<N, T>;
    private readonly tokensFactory: TokensFactory<TT>;
    private readonly parser: RootBuilder<TT, any, N, any>;
    private readonly writer: FileWriter;
    private watchdog: Watchdog<UnitInterface>;

    protected constructor(tokensFactory: TokensFactory<TT>, parser: RootBuilder<TT, any, N, any>, emit: boolean) {
        this.tokensFactory = tokensFactory;
        this.parser = parser;
        this.dependencyTree = new DependencyManager();
        this.writer = emit ? new FileWriter() : new DummyWriter();
    }

    public bootstrap(core: Core<C, N, T>, config: C): void {
        core.events
            .add(new RunPlugins(core.events, core.plugins))
            .add(new ReadAfterUpdate(core.events))
            .add(new ParseAfterRead(core.events, this.tokensFactory, this.parser))
            .add(new PatchAfterParse(core.events, this, this.dependencyTree))
            .add(new EmitAfterInterpreting(core.events, new EmitResolver(config), this.writer))
            .add({
                consume: (event: CoreEvent) => {
                    if (event.is(ReadyEvent)) {
                        if (!this.watchdog) {
                            core.stop(event);
                        }
                    } else if (this.watchdog && event.is(StopEvent)) {
                        this.watchdog.stop();
                    }

                    return event;
                },
            })
        ;

        if (config.watch) {
            this.watchdog = new Watchdog(config.watch);

            core.events.add(new WatchAfterReadyStage(core.events, this.watchdog, this.dependencyTree));
        }
    }

    resolve(_identifiable: T): Container<T> {
        return {};
    }

    abstract create(identifier: string): T;
}
