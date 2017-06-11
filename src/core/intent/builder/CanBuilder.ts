
import { Tokens } from '../../parser/Tokens';
import { BaseBuilder } from './BaseBuilder';
import { CanNode } from '../ast/CanNode';

export interface CanChildren {
}

export class CanBuilder extends BaseBuilder<CanNode, CanChildren> {
  public build(tokens: Tokens): CanNode {
    let can = new CanNode();
    can = null;
    return can;
  }
}
