import { Container } from '@intent/utils/Container';
import { Source } from '@intent/kernel/source/Source';
import { Compiler } from '@intent/kernel/transpiler/compiler/Compiler';
import { Sampler } from '@intent/kernel/transpiler/compiler/Sampler';
import { Substitutor } from '@intent/kernel/transpiler/compiler/Substitutor';
import { Template } from '@intent/kernel/transpiler/compiler/Template';
import { TranspilerConfig, WatchedTranspilerPipelineObserver } from '@intent/WatchedTranspilerPipeline';

import { Chip } from './chips/Chip';
import { QualifierResolver } from './chips/qualifier/QualifierResolver';
import { BaseUseResolver } from './chips/use/BaseUseResolver';
import { AlchemyTokenMatcher, AlchemyTokens } from './transpiler/Alchemy';
import { ChipNode } from './transpiler/ast/ChipNode';
import { AlchemyBuilder } from './transpiler/builder/AlchemyBuilder';
import { ChipTranspiler } from './transpiler/templates/ChipTranspiler';

export class TranspilerPipelineObserver extends WatchedTranspilerPipelineObserver<
  typeof AlchemyTokens,
  ChipNode,
  Chip
>
{
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

    chip.name = this.qualifierResolver.resolve(chip).path('.');

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
