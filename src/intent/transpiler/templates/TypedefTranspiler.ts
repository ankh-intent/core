
import { AbstractTranspiler, TranspilerInterface } from '../../../core/consumers/interpreting/transpiler/AbstractTranspiler';
import { TypeDefNode } from '../ast/TypeDefNode';
import { TypeNode } from '../ast/TypeNode';
import { CanTranspiler } from './CanTranspiler';
import { PropertyTranspiler } from './PropertyTranspiler';
import { ConstraintTranspiler } from './ConstraintTranspiler';
import { Container } from '../../../intent-utils/Container';

export class TypedefTranspiler extends AbstractTranspiler<TypeDefNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    extends    : new TypeExtendTranspiler(this.compiler),
    can        : new CanTranspiler(this.compiler),
    constraints: new ConstraintTranspiler(this.compiler),
    properties : new PropertyTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      class {%name%} {%extends%}{
        public {%*properties%};
        
        {%*constraints%}
        {%*can%}
      }
    `;
  }

  public resolve(data: TypeDefNode, key: string): any {
    switch (key) {
      case 'extends':
        return data.parent || undefined;
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
