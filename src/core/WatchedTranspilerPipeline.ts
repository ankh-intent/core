import { AnalyzedConsumer, IdentifiableFactory } from './consumers/ast-compiling/AnalyzedConsumer';
import { ParseConsumer } from './consumers/ast-compiling/ParseConsumer';
import { InterpretedConsumer } from './consumers/emitting/InterpretedConsumer';
import { EmitResolver } from './consumers/emitting/resolvers/EmitResolver';
import { DependencyModifiedConsumer } from './consumers/interpreting/DependencyModifiedConsumer';
import { ReadedConsumer, TokensFactory } from './consumers/parsing/ReadedConsumer';
import { UpdateConsumer } from './consumers/reading/UpdateConsumer';
import { CompiledConsumer, DependenciesResolver } from './consumers/watching/CompiledConsumer';
import { WatchdogReadyConsumer } from './consumers/watching/WatchdogReadyConsumer';
import { Core } from './Core';
import { CoreConfig } from './CoreConfig';
import { TreeNode } from './kernel/ast';
import { DependencyManager } from './kernel/dependencies/DependencyManager';
import { Identifiable } from './kernel/dependencies/DependencyNode';
import { ReadyEvent, StopEvent } from './kernel/event';
import { BaseTokenTypes } from './kernel/parser/Tokenizer';
import { DummyWriter, FileWriter } from './kernel/source';
import { TranspilerInterface } from './kernel/transpiler/AbstractTranspiler';
import { RootBuilder } from './kernel/transpiler/RootBuilder';
import { UnitInterface } from './kernel/watchdog/Unit';
import { Watchdog, WatchdogConfig } from './kernel/watchdog/Watchdog';
import { PipelineObserver } from './PipelineObserver';
import { Container } from './utils';

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

  public constructor(config: C, tokensFactory: TokensFactory<TT>, parser: RootBuilder<TT, any, N, any>, transpiler: TranspilerInterface<N>) {
    this.config = config;
    this.tokensFactory = tokensFactory;
    this.parser = parser;
    this.transpiler = transpiler;
    this.dependencyTree = new DependencyManager();
    this.writer = config.emit.files ? new FileWriter() : new DummyWriter();
  }

  public bootstrap(core: Core<C, N, T>, config: C): void {
    core.events
      .add(new UpdateConsumer(core.events))
      .add(new ReadedConsumer(core.events, this.tokensFactory))
      .add(new ParseConsumer(core.events, this.parser))
      .add(new AnalyzedConsumer(core.events, this, this.dependencyTree))
      .add(new CompiledConsumer(core.events, this, this.dependencyTree))
      .add(new DependencyModifiedConsumer(core.events, this.transpiler, config))
      .add(new InterpretedConsumer(core.events, new EmitResolver(config), this.writer))
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

      core.events.add(new WatchdogReadyConsumer(core.events, this.watchdog, this.dependencyTree));
    }
  }

  resolve(identifiable: T): Container<T> {
    return {};
  }

  abstract create(identifier: string): T;
}
