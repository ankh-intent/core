import { TreeWalker } from '@intent/plugins';

import { ModuleNode } from '@alchemy/ast';
import { TranslationContext } from './TranslationContext';

export abstract class RootTranslator<G> extends TreeWalker<ModuleNode, TranslationContext<undefined>, ModuleNode, G> {
}
