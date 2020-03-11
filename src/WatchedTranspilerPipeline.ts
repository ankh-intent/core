import { Container } from '@intent/utils';
import { DummyWriter, FileWriter } from '@intent/source';
import { BaseTokenTypes, TokensFactory } from '@intent/parser';
import { UnitInterface, Watchdog, WatchdogConfig } from '@intent/watchdog';

import {
  IdentifiableFactory,
  PatchAfterParse,
  EmitAfterInterpreting,
  InterpretAfterSynchronization,
  ParseAfterRead,
  ReadAfterUpdateStage,
  SynchronizeAfterPatch,
  DependenciesResolver,
  WatchAfterReadyStage,
  RunPlugins,
} from './consumers';
import { Core } from './Core';
import { CoreConfig } from './CoreConfig';
import {
  TreeNode, Identifiable, DependencyManager,
  ReadyEvent, StopEvent,
  TranspilerInterface, RootBuilder,
  EmitResolver,
} from './kernel';
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
  implements
    PipelineObserver<C, N, T>,
    IdentifiableFactory<N, T>,
    DependenciesResolver<N, T>
{
  private readonly config: C;
  private readonly dependencyTree: DependencyManager<N, T>;
  private readonly tokensFactory: TokensFactory<TT>;
  private readonly parser: RootBuilder<TT, any, N, any>;
  private readonly transpiler: TranspilerInterface<N>;
  private readonly writer: FileWriter;
  private watchdog: Watchdog<UnitInterface>;

  protected constructor(config: C, tokensFactory: TokensFactory<TT>, parser: RootBuilder<TT, any, N, any>, transpiler: TranspilerInterface<N>) {
    this.config = config;
    this.tokensFactory = tokensFactory;
    this.parser = parser;
    this.transpiler = transpiler;
    this.dependencyTree = new DependencyManager();
    this.writer = config.emit.files ? new FileWriter() : new DummyWriter();
  }

  public bootstrap(core: Core<C, N, T>, config: C): void {
    core.events
      .add(new RunPlugins(core.events, core.plugins))
      .add(new ReadAfterUpdateStage(core.events))
      .add(new ParseAfterRead(core.events, this.tokensFactory, this.parser))
      .add(new PatchAfterParse(core.events, this, this.dependencyTree))
      .add(new SynchronizeAfterPatch(core.events, this, this.dependencyTree))
      .add(new InterpretAfterSynchronization(core.events, this.transpiler, config))
      .add(new EmitAfterInterpreting(core.events, new EmitResolver(config), this.writer))
      .add({
        consume: (event) => {
          if (event instanceof ReadyEvent) {
            if (!this.watchdog) {
              core.stop(event);
            }
          } else
          if ((event instanceof StopEvent) && this.watchdog) {
            this.watchdog.stop();
          }

          return event;
        }
      })
    ;

    if (config.watch) {
      this.watchdog = new Watchdog(config.watch);

      core.events.add(new WatchAfterReadyStage(core.events, this.watchdog, this.dependencyTree));
    }
  }

  resolve(identifiable: T): Container<T> {
    return {};
  }

  abstract create(identifier: string): T;
}
