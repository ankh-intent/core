
import { AbstractTranspiler } from '../../transpiler/AbstractTranspiler';
import { TypeNode } from '../../intent/ast/TypeNode';

export class TypeTranspiler extends AbstractTranspiler<TypeNode> {
  protected get code(): string {
    return `{%qualifier%}{%generic%}`;
  }

  public resolve(data: TypeNode, key: string): any {
    switch (key) {
      case 'qualifier':
        return data.qualifier.path();

      case 'generic':
        return data.generic ? '<' + this.transpile(data.generic) + '>' : null;
    }

    return super.resolve(data, key);
  }
}
