import { Container } from '@intent/utils';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler';

import { TypeDefNode, TypeNode } from '../ast';
import { CanTranspiler } from './CanTranspiler';
import { PropertyTranspiler } from './PropertyTranspiler';
import { ConstraintTranspiler } from './ConstraintTranspiler';

export class TypedefTranspiler extends AbstractTranspiler<TypeDefNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    extends    : new TypeExtendTranspiler(this.compiler),
    constructor: new TypeConstructorTranspiler(this.compiler),
    can        : new CanTranspiler(this.compiler),
    constraints: new ConstraintTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      class {%name%} {%extends%} {
        {%*constructor%}
        {%*constraints%}
        {%*can%}
      }
    `;
  }

  public resolve(data: TypeDefNode, key: string): any {
    switch (key) {
      case 'extends':
        return data.parent || undefined;
      case 'constructor':
        return Object.keys(data.properties).length ? [data] : [];
    }

    return super.resolve(data, key);
  }
}

export class TypeConstructorTranspiler extends AbstractTranspiler<TypeDefNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    properties : new PropertyTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
        public constructor(
          public {%*properties%},
        ) {
          {%super%}
        }
    `;
  }

  public resolve(data: TypeDefNode, key: string): any {
    switch (key) {
      case 'super':
        return data.parent ? 'super();' : undefined;
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
