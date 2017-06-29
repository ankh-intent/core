
import { AbstractTranspiler } from './AbstractTranspiler';
import { ConstraintNode } from '../../../../../intent/ast/ConstraintNode';
import { CanTranspiler } from './CanTranspiler';

export class ConstraintTranspiler extends AbstractTranspiler<ConstraintNode> {
  private can = new CanTranspiler(this.compiler);

  protected get code(): string {
    return `{%can%}`;
  }

  public resolve(data: ConstraintNode, key: string): any {
    switch (key) {
      case 'can':
        return this.can.transpile(data.can);
    }

    return super.resolve(data, key);
  }
}
