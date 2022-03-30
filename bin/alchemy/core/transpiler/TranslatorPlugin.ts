import { PatchedASTEvent, IdentifiableFactory } from '@intent/consumers';
import { DependencyManager } from '@intent/kernel';
import { PluginEnvironment, InterpretPlugin } from '@intent/plugins';

import { Module } from '../modules';
import { ModuleNode } from './ast';
import { TranslationContext, AlchemyTranslator } from './translation';

export class TranslatorPlugin extends InterpretPlugin<ModuleNode, Module, TranslationContext<undefined>> {
  private readonly translator: AlchemyTranslator;

  constructor(factory: IdentifiableFactory<ModuleNode, Module>, tree: DependencyManager<ModuleNode, Module>) {
    super();
    this.translator = new AlchemyTranslator(factory, tree);
  }

  protected createContext(env): TranslationContext<undefined> {
    return TranslationContext.createContext(env);
  }

  protected visitRoot(env: PluginEnvironment<PatchedASTEvent<ModuleNode, Module>>, root, context): boolean | void {
    const module = this.translator.visit(root, context);

    // console.log(root, module);

    env.events.stat({
      type: 'log',
      message: {
        module: String(module),
      },
    });
  }
}
