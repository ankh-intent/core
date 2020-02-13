import { AbstractNode } from '@intent/kernel/ast';

import { ObjectPropertyNode } from './ObjectPropertyNode';

export class ObjectNode extends AbstractNode {
  constructor(
    public properties: Map<string, ObjectPropertyNode> = new Map(),
  ) {
    super();
  }
}
