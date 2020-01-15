import { Container } from '@intent/utils';
import { Source } from '@intent/kernel/source';
import { Compiler, Sampler, Substitutor, Template } from '@intent/kernel/compiler';
import { TranspilerConfig, WatchedTranspilerPipelineObserver } from '@intent/WatchedTranspilerPipeline';

import { IntentModule } from './kernel/IntentModule';
import { ModuleNode } from './transpiler/ast';
import { IntentBuilder } from './transpiler/builder/IntentBuilder';
import { IntentTokensMatcher } from './transpiler/Intent';
import { ModuleTranspiler } from './transpiler/templates/ModuleTranspiler';

export class TranspilerPipelineObserver extends WatchedTranspilerPipelineObserver<ModuleNode, IntentModule > {
  public constructor(config: TranspilerConfig) {
    const sampler = new Sampler('{%', '%}');
    const substitutor = new Substitutor(sampler);

    super(
      config,
      (source: Source) => new IntentTokensMatcher(source, source.range()),
      new IntentBuilder(),
      new ModuleTranspiler(
        new Compiler(
          sampler,
          (code, resolver) => new Template(code, substitutor, resolver),
        ),
      ),
    );
  }

  create(identifier: string): IntentModule {
    const chip = new IntentModule(identifier);

    // chip.name = this.qualifierResolver.resolve(chip).path('.');

    return chip;
  }

  resolve(identifiable: IntentModule): Container<IntentModule> {
    return {};
    // const links = {};
    //
    // for (const use of Object.values(identifiable.ast.uses)) {
    //   const link = this.useResolver.resolve(identifiable, use.qualifier);
    //
    //   if (!link) {
    //     throw new Error(`Can't resolve chip "${use.qualifier.path('.')}"`);
    //   }
    //
    //   links[link.identifier] = link;
    // }
    //
    // return links;
  }
}
