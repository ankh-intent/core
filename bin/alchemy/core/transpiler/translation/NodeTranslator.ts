import { TreeNode } from '@intent/kernel';
import { Walker, NodeIdentifiersMap } from '@intent/plugins';
import { Strings } from '@intent/utils';
import { TranslationContext } from './TranslationContext';

export abstract class NodeTranslator<N extends TreeNode, O, I extends NodeIdentifiersMap> extends Walker<N, TranslationContext, O, I> {
  visit(node: N, context: TranslationContext): O {
    return this.translate(node, context);
  }

  protected get name(): string {
    return Strings.camelCaseToSnakeCase(
      this.constructor.name.replace(/Translator$/, '')
    );
  }

  abstract translate(node: N, context: TranslationContext): O;
}
