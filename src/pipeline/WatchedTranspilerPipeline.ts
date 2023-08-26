import { Container } from '@intent/utils';
import { DummyWriter, FileWriter } from '@intent/source';
import { BaseTokenTypes, TokensFactory } from '@intent/parser';
import { UnitInterface, Watchdog, WatchdogConfig } from '@intent/watchdog';
import {
    TreeNode,
    Identifiable,
    DependencyManager,
    ReadyEvent,
    StopEvent,
    RootBuilder,
    EmitResolver,
} from '@intent/kernel';
import {
    IdentifiableFactory,
    PatchAfterParse,
    EmitAfterInterpreting,
    ParseAfterRead,
    ReadAfterUpdateStage,
    DependenciesResolver,
    WatchAfterReadyStage,
    RunPlugins,
} from '@intent/consumers';
import { CoreConfig } from '@intent/config';

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
    implements PipelineObserver<C, N, T>, IdentifiableFactory<N, T>, DependenciesResolver<N, T>
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
            .add(new ReadAfterUpdateStage(core.events))
            .add(new ParseAfterRead(core.events, this.tokensFactory, this.parser))
            .add(new PatchAfterParse(core.events, this, this.dependencyTree))
            .add(new EmitAfterInterpreting(core.events, new EmitResolver(config), this.writer))
            .add({
                consume: (event) => {
                    if (event instanceof ReadyEvent) {
                        if (!this.watchdog) {
                            core.stop(event);
                        }
                    } else if ((event instanceof StopEvent) && this.watchdog) {
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
