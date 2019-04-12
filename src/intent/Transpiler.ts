import { PipelineObserver, Core, CoreConfig } from '../Core';
import { IntentBuilder } from './transpiler/builder/IntentBuilder';
import { AnalyzedConsumer } from '../core/consumers/ast-compiling/AnalyzedConsumer';
import { DependencyModifiedConsumer, InterpreterConfig, } from '../core/consumers/interpreting/DependencyModifiedConsumer';
import { FileEmitResolver } from './chips/FileEmitResolver';
import { ReadedConsumer } from '../core/consumers/parsing/ReadedConsumer';
import { QualifierResolver } from './chips/qualifier/QualifierResolver';
import { InterpretedConsumer } from '../core/consumers/emitting/InterpretedConsumer';
import { UpdateConsumer } from '../core/consumers/reading/UpdateConsumer';
import { ParseConsumer } from '../core/consumers/ast-compiling/ParseConsumer';
import { CompiledConsumer } from '../core/consumers/watching/CompiledConsumer';
import { FileWriter } from '../core/consumers/reading/source/FileWriter';
import { DummyWriter } from '../core/consumers/reading/source/DummyWriter';
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
