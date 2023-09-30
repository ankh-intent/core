import { TranslationContext } from '@intent/translator';
import { Operation } from '@alchemy/modules';
import {
    OperationNode,
    CallNode,
    ChainNode,
    IsDomainNode,
    IndexedNode, ExpressionNode, PostfixNode,
} from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../AlchemyNodeTranslator';

export type OperationTranslatorChildren = {
    call: CallNode;
    chain: ChainNode;
    indexed: IndexedNode;
    is_domain: IsDomainNode;
    postfix: PostfixNode;
    expression: ExpressionNode;
};

export class OperationTranslator extends AlchemyNodeTranslator<Operation, OperationTranslatorChildren> {
    translate(node: OperationNode, context: TranslationContext<any>): Operation {
        if (node instanceof CallNode) {
            return this.child.call(node, context);
        } else if (node instanceof ChainNode) {
            return this.child.chain(node, context);
        } else if (node instanceof IsDomainNode) {
            return this.child.is_domain(node, context);
        } else if (node instanceof IndexedNode) {
            return this.child.indexed(node, context);
        } else if (node instanceof PostfixNode) {
            return this.child.postfix(node, context);
        } else if (node.right instanceof ExpressionNode) {
            return Operation.create(node, context.parentNode, {
                operation: node.operation,
                binary: node.binary,
                right: this.child.expression(node.right, context),
            });
        }

        throw new Error(`/* unknown operation "${node.node}" */ ${node.astRegion.extract()}`);
    }
}
