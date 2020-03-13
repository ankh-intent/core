import { TreeNode } from '@intent/kernel';
import { Walker, NodeIdentifiersMap } from '@intent/plugins';
import { Strings } from '@intent/utils';

import { Translated } from '../../modules';
import { TranslationContext } from './TranslationContext';
import { TranslationError } from './TranslationError';

export abstract class NodeTranslator<T extends Translated<N>, I extends NodeIdentifiersMap, N extends TreeNode = TreeNode> extends Walker<N, TranslationContext<any>, T, I> {
  visit(node: N, context: TranslationContext<any>): T {
    try {
      return this.translate(node, context);
    } catch (e) {
      if (e instanceof TranslationError) {
        throw new TranslationError(`Failed processing "${node.node}" AST node`, node, e);
      } else {
        throw new TranslationError(`Failed processing "${node.node}" AST node: ${e.message}`, node, e);
      }
    }
  }

  protected get name(): string {
    return Strings.camelCaseToSnakeCase(
      this.constructor.name.replace(/Translator$/, '')
    );
  }

  abstract translate(node: N, context: TranslationContext<any>): T;
}
