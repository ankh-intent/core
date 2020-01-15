import { Container } from '@intent/utils';
import { Source } from '@intent/kernel/source';
import { Compiler, Sampler, Substitutor, Template } from '@intent/template';
import { TranspilerConfig, WatchedTranspilerPipelineObserver } from '@intent/WatchedTranspilerPipeline';

import { Chip } from './chips/Chip';
import { QualifierResolver } from './chips/qualifier/QualifierResolver';
import { BaseUseResolver } from './chips/use/BaseUseResolver';
import { AlchemyTokenMatcher } from './transpiler/Alchemy';
import { ChipNode } from './transpiler/ast';
import { AlchemyBuilder } from './transpiler/builder/AlchemyBuilder';
import { ChipTranspiler } from './transpiler/templates/ChipTranspiler';

export class TranspilerPipelineObserver extends WatchedTranspilerPipelineObserver<ChipNode, Chip > {
  private readonly qualifierResolver: QualifierResolver;
  private readonly useResolver: BaseUseResolver;

  public constructor(config: TranspilerConfig) {
    const sampler = new Sampler('{%', '%}');
    const substitutor = new Substitutor(sampler);

    super(
      config,
      (source: Source) => new AlchemyTokenMatcher(source, source.range()),
      new AlchemyBuilder(),
      new ChipTranspiler(
        new Compiler(
          sampler,
          (code, resolver) => new Template(code, substitutor, resolver),
        ),
      ),
    );
    this.qualifierResolver = new QualifierResolver(config.paths);
    this.useResolver = new BaseUseResolver(config.paths);
  }

  create(identifier: string): Chip {
    const chip = new Chip(identifier);
    const qualifier = this.qualifierResolver.resolve(chip);

    if (qualifier) {
      chip.name = qualifier.path('.');
    }

    return chip;
  }

  resolve(identifiable: Chip): Container<Chip> {
    const links = {};

    for (const use of Object.values(identifiable.ast.uses)) {
      const link = this.useResolver.resolve(identifiable, use.qualifier);

      if (!link) {
        throw new Error(`Can't resolve chip "${use.qualifier.path('.')}"`);
      }

      links[link.identifier] = link;
    }

    return links;
  }
}
