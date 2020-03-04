import { AbstractNode } from '@intent/kernel';

import { UseNode } from './UseNode';

export class UsesNode extends AbstractNode {
  public constructor(
    public map: Map<string, UseNode> = new Map(),
  ) {
    super();
  };

  public get entries(): [string, UseNode][] {
    return [...this.map.entries()];
  }
}
