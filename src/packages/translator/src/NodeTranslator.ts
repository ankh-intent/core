import { Strings, TreeNode } from '@intent/kernel';
import { Walker, NodeIdentifiersMap } from '@intent/plugins';

import { Translated } from './Translated';
import { TranslationContext } from './TranslationContext';
import { TranslationError } from './TranslationError';

export abstract class NodeTranslator<T extends Translated<N>, I extends NodeIdentifiersMap, N extends TreeNode = TreeNode> extends Walker<N, TranslationContext<any>, T, I> {
    visit(node: N, context: TranslationContext<any>): T {
        if (!node) {
            throw new Error(`Failed processing "${this.name}" AST node: node is ${node}`);
        }

        try {
            return this.translate(node, context);
        } catch (e) {
            throw new TranslationError(`Failed processing "${node.node}" AST node`, node, e);
        }
    }

    protected get name(): string {
        return Strings.camelCaseToSnakeCase(
            this.constructor.name.replace(/Translator$/, ''),
        );
    }

    abstract translate(node: N, context: TranslationContext<any>): T;
}
