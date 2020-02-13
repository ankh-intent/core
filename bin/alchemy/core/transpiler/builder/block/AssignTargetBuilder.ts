import { TypedTokenMatcherInterface } from '@intent/parser';

import { IdentifierNode, AssignmentTargetNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignTargetChildren = {
  identifier: IdentifierNode;
};

export class AssignTargetBuilder extends BaseBuilder<AssignmentTargetNode, AssignTargetChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    ensure.identifier('let');

    return new AssignmentTargetNode(
      this.child.identifier(tokens),
    );
  }
}
