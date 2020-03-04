import { AbstractNode } from '@intent/kernel';

import { ObjectPropertyNode } from './ObjectPropertyNode';

export class ObjectNode extends AbstractNode {
  constructor(
    public properties: Map<string, ObjectPropertyNode> = new Map(),
  ) {
    super();
  }
}
