
import { AbstractTranspiler } from './AbstractTranspiler';
import { TypeDefNode } from '../../../../../intent/ast/TypeDefNode';
import { TypeNode } from '../../../../../intent/ast/TypeNode';
import { CanTranspiler } from './CanTranspiler';
import { PropertyTranspiler } from './PropertyTranspiler';
import { ConstraintTranspiler } from './ConstraintTranspiler';

export class TypedefTranspiler extends AbstractTranspiler<TypeDefNode> {
  private extend = new TypeExtendTranspiler(this.compiler);
  private can = new CanTranspiler(this.compiler);
  private constraints = new ConstraintTranspiler(this.compiler);
  private property = new PropertyTranspiler(this.compiler);

  protected get code(): string {
    return `
      class {%name%}{%extends%}{
        public {%properties%};
        {%constraints%}
        {%can%}
      }
    `;
  }

  public resolve(data: TypeDefNode, key: string): any {
    switch (key) {
      case 'extends':
        return data.parent ? ` ${this.extend.transpile(data.parent)} ` : ' ';

      case 'properties':
        return Object.keys(data.properties)
          .map((name) => this.property.transpile(data.properties[name]))
        ;

      case 'constraints':
        return Object.keys(data.constraints)
          .map((name) => this.constraints.transpile(data.constraints[name]))
        ;
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
