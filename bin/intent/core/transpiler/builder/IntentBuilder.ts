import { BaseTokenTypes } from '@intent/parser';
import { RootBuilder } from '@intent/kernel/transpiler';

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

