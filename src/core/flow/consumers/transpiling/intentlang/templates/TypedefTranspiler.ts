
import { AbstractTranspiler } from './AbstractTranspiler';
import { TypeDefNode } from '../../../../../intent/ast/TypeDefNode';
import { TypeNode } from '../../../../../intent/ast/TypeNode';
import { CanTranspiler } from './CanTranspiler';

export class TypedefTranspiler extends AbstractTranspiler<TypeDefNode> {
  private extend = new TypeExtendTranspiler(this.compiler);
  private can = new CanTranspiler(this.compiler);

  protected get code(): string {
    return `
      class {%name%}{%extends%}{
        public {%properties%};
        {%can%}
      }
    `;
  }

  public resolve(data: TypeDefNode, key: string): any {
    switch (key) {
      case 'extends':
        return data.parent ? ` ${this.extend.transpile(data.parent)} ` : ' ';

      case 'can':
        return Object.keys(data.can)
          .map((name) => this.can.transpile(data.can[name]))
        ;
    }

    return super.resolve(data, key);
  }
}


export class TypeExtendTranspiler extends AbstractTranspiler<TypeNode> {
  protected get code(): string {
    return `extends {%name%}`;
  }

  public resolve(data: TypeNode, key: string): any {
    switch (key) {
      case 'name': return data.qualifier.path();
    }

    return super.resolve(data, key);
  }
}
