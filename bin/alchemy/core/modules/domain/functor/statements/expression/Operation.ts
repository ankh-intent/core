import { AbstractNode } from '@intent/ast';

import { OperationNode } from '../../../../../transpiler/ast';
import { Translated } from '../../../../Translated';

const MAP = {
  '&': '&&',
  '|': '||',
};
const mapOperations = (operation: string) => MAP[operation] || operation;

export class Operation<N extends AbstractNode = AbstractNode> extends Translated<OperationNode<N>> {
  public binary: boolean = false;
  public operation: string;
  public right: Translated<N>;

  toString() {
    return `${this.binary ? ' ' : ''}${mapOperations(this.operation)}${this.binary ? ' ' : ''}${this.right || ''}`;
  }
}
