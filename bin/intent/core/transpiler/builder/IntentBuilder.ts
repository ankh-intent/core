import { BaseTokenTypes } from '@intent/kernel/parser';
import { RootBuilder } from '@intent/kernel/transpiler/RootBuilder';

import { ModuleNode } from '../ast';
import { ModuleBuilder, ModuleChildren } from './ModuleBuilder';

type IntentGrammar =
  ModuleChildren
;

export class IntentBuilder extends RootBuilder<BaseTokenTypes, IntentGrammar, ModuleNode> {
  protected get builders() {
    return {
      root: new ModuleBuilder(this.invokers),
    };
  }
}

