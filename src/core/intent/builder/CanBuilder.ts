
import { Tokens } from '../../parser/Tokens';
import { BaseBuilder } from './BaseBuilder';
import { CanNode } from '../ast/CanNode';

interface CanChildren {
}

export class CanBuilder extends BaseBuilder<CanNode, CanChildren> {
  public build(tokens: Tokens): CanNode {
    if (tokens.not({value: 'can'})) {
      return null;
    }

    let can = new CanNode();
    can = null;
    return can;
  }
}
