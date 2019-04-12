import { DummyWriter } from '@intent/kernel/source/DummyWriter';
import { FileWriter } from '@intent/kernel/source/FileWriter';
import { AnalyzedConsumer } from '@intent/consumers/ast-compiling/AnalyzedConsumer';
import { ParseConsumer } from '@intent/consumers/ast-compiling/ParseConsumer';
import { InterpretedConsumer } from '@intent/consumers/emitting/InterpretedConsumer';
import { DependencyModifiedConsumer, InterpreterConfig, } from '@intent/consumers/interpreting/DependencyModifiedConsumer';
import { ReadedConsumer } from '@intent/consumers/parsing/ReadedConsumer';
import { UpdateConsumer } from '@intent/consumers/reading/UpdateConsumer';
import { CompiledConsumer } from '@intent/consumers/watching/CompiledConsumer';
import { Core, CoreConfig, PipelineObserver } from '@intent/Core';

import { FileEmitResolver } from './chips/FileEmitResolver';
import { QualifierResolver } from './chips/qualifier/QualifierResolver';
import { ResolverConfig } from './chips/ResolverConfig';
import { ConfigProvider } from './ConfigProvider';
import { IntentBuilder } from './transpiler/builder/IntentBuilder';

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
