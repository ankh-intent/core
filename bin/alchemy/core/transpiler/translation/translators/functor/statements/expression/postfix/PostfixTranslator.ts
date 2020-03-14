import { Postfix } from '../../../../../../../modules';
import { ReferenceNode, PostfixNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type PostfixTranslatorChildren = {
  reference: ReferenceNode;
};

export class PostfixTranslator extends NodeTranslator<Postfix, PostfixTranslatorChildren> {
  translate(node: PostfixNode, c): Postfix {
    return Postfix.create(node, c.parent, {
      operation: node.operation,
    });
  }
}
