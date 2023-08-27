import { TreeNode } from '@intent/kernel';
import { NodeIdentifiersMap } from '@intent/plugins';
import { Translated, NodeTranslator } from '@intent/translator';

export abstract class AlchemyNodeTranslator<
    T extends Translated<N>,
    I extends NodeIdentifiersMap,
    N extends TreeNode = TreeNode
>
    extends NodeTranslator<T, I, N> {
}
