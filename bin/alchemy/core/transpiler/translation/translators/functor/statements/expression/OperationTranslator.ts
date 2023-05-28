import { Operation } from '../../../../../../modules';
import {
    OperationNode,
    CallNode,
    ChainNode,
    IsDomainNode,
    IndexedNode, ExpressionNode, PostfixNode,
} from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';

export type OperationTranslatorChildren = {
    call: CallNode;
    chain: ChainNode;
    indexed: IndexedNode;
    is_domain: IsDomainNode;
    postfix: PostfixNode;
    expression: ExpressionNode;
};

export class OperationTranslator extends NodeTranslator<Operation, OperationTranslatorChildren> {
    translate(node: OperationNode, c): Operation {
        if (node instanceof CallNode) {
            return this.child.call(node, c);
        } else if (node instanceof ChainNode) {
            return this.child.chain(node, c);
        } else if (node instanceof IsDomainNode) {
            return this.child.is_domain(node, c);
        } else if (node instanceof IndexedNode) {
            return this.child.indexed(node, c);
        } else if (node instanceof PostfixNode) {
            return this.child.postfix(node, c);
        } else if (node.right instanceof ExpressionNode) {
            return Operation.create(node, c.parent, {
                operation: node.operation,
                binary: node.binary,
                right: this.child.expression(node.right, c),
            });
        }

        throw new Error(`/* unknown operation "${node.node}" */ ${node.astRegion.extract()}`);
    }
}
