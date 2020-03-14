import { IdentifierNode } from '../../../../../transpiler/ast/expression';
import { Operation } from '../Operation';

export class Chain extends Operation<IdentifierNode> {
  public readonly binary = false;
  public readonly operation = '.';
}
