import { TreeNode } from '@intent/kernel';
import { TreeWalker } from '@intent/plugins';

import { TranslationContext } from './TranslationContext';

export abstract class RootTranslator<N extends TreeNode, G> extends TreeWalker<N, TranslationContext<undefined>, N, G> {
}
