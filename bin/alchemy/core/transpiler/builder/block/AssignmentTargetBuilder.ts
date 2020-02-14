import { TypedTokenMatcherInterface } from '@intent/parser';

import { IdentifierNode, AssignmentTargetNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignmentTargetChildren = {
  identifier: IdentifierNode;
};

export class AssignmentTargetBuilder extends BaseBuilder<AssignmentTargetNode, AssignmentTargetChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    ensure.identifier('let');

    return new AssignmentTargetNode(
      this.child.identifier(tokens),
    );
  }
}
