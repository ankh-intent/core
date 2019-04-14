import { AnalyzedConsumer, IdentifiableFactory } from '@intent/consumers/ast-compiling/AnalyzedConsumer';
import { ParseConsumer } from '@intent/consumers/ast-compiling/ParseConsumer';
import { InterpretedConsumer } from '@intent/consumers/emitting/InterpretedConsumer';
import { DependencyModifiedConsumer, InterpreterConfig } from '@intent/consumers/interpreting/DependencyModifiedConsumer';
import { ReadedConsumer } from '@intent/consumers/parsing/ReadedConsumer';
import { UpdateConsumer } from '@intent/consumers/reading/UpdateConsumer';
import { CompiledConsumer, DependenciesResolver } from '@intent/consumers/watching/CompiledConsumer';
import { Core, CoreConfig, PipelineObserver } from '@intent/Core';
import { DummyWriter } from '@intent/kernel/source/DummyWriter';
import { FileWriter } from '@intent/kernel/source/FileWriter';
import { Compiler } from '@intent/kernel/transpiler/compiler/Compiler';
import { Sampler } from '@intent/kernel/transpiler/compiler/Sampler';
import { Substitutor } from '@intent/kernel/transpiler/compiler/Substitutor';
import { Template } from '@intent/kernel/transpiler/compiler/Template';
import { Container } from '@intent/utils/Container';
import { Objects } from '@intent/utils/Objects';

import { Chip } from './chips/Chip';
import { FileEmitResolver } from './chips/FileEmitResolver';
import { QualifierResolver } from './chips/qualifier/QualifierResolver';
import { ResolverConfig } from './chips/ResolverConfig';
import { BaseUseResolver } from './chips/use/BaseUseResolver';
import { ChipNode } from './transpiler/ast/ChipNode';
import { IntentBuilder } from './transpiler/builder/IntentBuilder';
import { ChipTranspiler } from './transpiler/templates/ChipTranspiler';

export interface OutputConfig {
  path: string;
  extension: string;
}

export interface TranspilerConfig extends CoreConfig {
  output: OutputConfig;
  resolver: ResolverConfig;
  interpreter: InterpreterConfig;
}

export class TranspilerPipelineObserver
  implements
    PipelineObserver<TranspilerConfig, ChipNode, Chip>,
    IdentifiableFactory<ChipNode, Chip>,
    DependenciesResolver<ChipNode, Chip>
{
  private parser: IntentBuilder;
  private transpiler: ChipTranspiler;
  private config: TranspilerConfig;
  private qualifierResolver: QualifierResolver;
  private useResolver: BaseUseResolver;

  public constructor(config: TranspilerConfig) {
    this.config = config;
    const sampler = new Sampler('{%', '%}');
    const substitutor = new Substitutor(sampler);
    this.parser = new IntentBuilder();
    this.transpiler = new ChipTranspiler(
      new Compiler(
        sampler,
        (code, resolver) => new Template(code, substitutor, resolver),
      ),
    );
    this.qualifierResolver = new QualifierResolver(config);
    this.useResolver = new BaseUseResolver(config);
  }

  public bootstrap(core: Core<TranspilerConfig, ChipNode, Chip>, config: TranspilerConfig): void {
    const writer = config.emit.files ? new FileWriter() : new DummyWriter();

    core.events
      .add(new UpdateConsumer(core.events))
      .add(new ReadedConsumer(core.events))
      .add(new ParseConsumer(core.events, this.parser))
      .add(new AnalyzedConsumer(core.events, this, core.dependencyTree))
      .add(new CompiledConsumer(core.events, this, core.dependencyTree))
      .add(new DependencyModifiedConsumer(core.events, this.transpiler, config))
      .add(new InterpretedConsumer(core.events, new FileEmitResolver(config), writer))
    ;
  }

  create(identifier: string): Chip {
    const chip = new Chip(identifier);

    chip.name = this.qualifierResolver.resolve(chip).path('.');

    return chip;
  }

  resolve(identifiable: Chip): Container<Chip> {
    const links = {};

    for (const use of Objects.iterate(identifiable.ast.uses)) {
      const link = this.useResolver.resolve(identifiable, use.qualifier);

      if (!link) {
        throw new Error(`Can't resolve chip "${use.qualifier.path('.')}"`);
      }

      links[link.identifier] = link;
    }

    return links;
  }
}
