import { PatchedASTEvent, IdentifiableFactory } from '@intent/consumers';
import { StatEvent, DependencyManager } from '@intent/kernel';
import { TranslateASTPlugin, PluginEnvironment } from '@intent/plugins';

import { Module } from '../../modules';
import { ModuleNode } from '../ast';
import { TranslationContext } from './TranslationContext';
import { AlchemyTranslator } from './translators';

export class TranslatorPlugin extends TranslateASTPlugin<ModuleNode, Module, TranslationContext<undefined>> {
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

    env.events.emit(new StatEvent({
      parent: env.event,
      stat: {
        type: 'log',
        message: {
          module: String(module),
        },
      },
    }));
  }
}
