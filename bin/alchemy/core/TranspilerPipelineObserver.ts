import { Container } from '@intent/utils';
import { Source } from '@intent/source';
import { Compiler, Sampler, Substitutor, Template } from '@intent/template';
import { TranspilerConfig, WatchedTranspilerPipelineObserver } from '@intent/WatchedTranspilerPipeline';

import { Module } from './chips/Module';
import { QualifierResolver } from './chips/qualifier/QualifierResolver';
import { BaseUseResolver } from './chips/use/BaseUseResolver';
import { AlchemyTokenMatcher } from './transpiler/Alchemy';
import { ModuleNode } from './transpiler/ast';
import { AlchemyBuilder } from './transpiler/builder/AlchemyBuilder';
import { ModuleTranspiler } from './transpiler/templates/ModuleTranspiler';

export class TranspilerPipelineObserver extends WatchedTranspilerPipelineObserver<ModuleNode, Module > {
  private readonly qualifierResolver: QualifierResolver;
  private readonly useResolver: BaseUseResolver;

  public constructor(config: TranspilerConfig) {
    const sampler = new Sampler('{%', '%}');
    const substitutor = new Substitutor(sampler);

    super(
      config,
      (source: Source) => new AlchemyTokenMatcher(source, source.range()),
      new AlchemyBuilder(),
      new ModuleTranspiler(
        new Compiler(
          sampler,
          (code, resolver) => new Template(code, substitutor, resolver),
        ),
      ),
    );
    this.qualifierResolver = new QualifierResolver(config.paths);
    this.useResolver = new BaseUseResolver(config.paths);
  }

  create(identifier: string): Module {
    const module = new Module(identifier);
    const qualifier = this.qualifierResolver.resolve(module);

    if (qualifier) {
      module.name = qualifier.path('.');
    }

    return module;
  }

  resolve(identifiable: Module): Container<Module> {
    const links = {};

    for (const use of Object.values(identifiable.ast.uses)) {
      const link = this.useResolver.resolve(identifiable, use.decomposition.qualifier);

      if (!link) {
        throw new Error(`Can't resolve module "${use.decomposition.qualifier.path('.')}"`);
      }

      links[link.identifier] = link;
    }

    return links;
  }
}
