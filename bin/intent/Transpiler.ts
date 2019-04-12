import { PipelineObserver, Core, CoreConfig } from '../../src/core/Core';
import { IntentBuilder } from './transpiler/builder/IntentBuilder';
import { AnalyzedConsumer } from '../../src/core/consumers/ast-compiling/AnalyzedConsumer';
import { DependencyModifiedConsumer, InterpreterConfig, } from '../../src/core/consumers/interpreting/DependencyModifiedConsumer';
import { FileEmitResolver } from './chips/FileEmitResolver';
import { ReadedConsumer } from '../../src/core/consumers/parsing/ReadedConsumer';
import { QualifierResolver } from './chips/qualifier/QualifierResolver';
import { InterpretedConsumer } from '../../src/core/consumers/emitting/InterpretedConsumer';
import { UpdateConsumer } from '../../src/core/consumers/reading/UpdateConsumer';
import { ParseConsumer } from '../../src/core/consumers/ast-compiling/ParseConsumer';
import { CompiledConsumer } from '../../src/core/consumers/watching/CompiledConsumer';
import { FileWriter } from '~kernel/source/FileWriter';
import { DummyWriter } from '~kernel/source/DummyWriter';
import { ConfigProvider } from './ConfigProvider';
import { ResolverConfig } from './chips/ResolverConfig';

export interface OutputConfig {
  path: string;
  extension: string;
}

export interface TranspilerConfig extends CoreConfig {
  output: OutputConfig;
  resolver: ResolverConfig;
  interpreter: InterpreterConfig;
}

export class Transpiler implements PipelineObserver<TranspilerConfig> {
  private parser: IntentBuilder;

  public constructor() {
    this.parser = new IntentBuilder();
  }

  public attach(core: Core<TranspilerConfig>, config: CoreConfig): TranspilerConfig {
    return (new ConfigProvider(<TranspilerConfig>config)).build(core);
  }

  public bootstrap(core: Core<TranspilerConfig>, config: TranspilerConfig): void {
    const writer = config.emit.files ? new FileWriter() : new DummyWriter();

    core.events
      .add(new UpdateConsumer(core.events))
      .add(new ReadedConsumer(core.events))
      .add(new ParseConsumer(core.events, this.parser))
      .add(new AnalyzedConsumer(core.events, new QualifierResolver(config), core.dependencyTree))
      .add(new CompiledConsumer(core.events, config, core.dependencyTree))
      .add(new DependencyModifiedConsumer(core.events, config))
      .add(new InterpretedConsumer(core.events, new FileEmitResolver(config), writer))
    ;
  }
}
