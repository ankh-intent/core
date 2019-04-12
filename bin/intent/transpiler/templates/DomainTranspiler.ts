import { AbstractTranspiler, TranspilerInterface } from '~kernel/transpiler/AbstractTranspiler';

import { DomainNode } from '../ast/DomainNode';
import { TypedefTranspiler } from './TypedefTranspiler';
import { TypeDefNode } from '../ast/TypeDefNode';
import { UseTranspiler } from './UseTranspiler';
import { Container } from '../../../../src/core/utils/Container';

export class DomainTranspiler extends AbstractTranspiler<DomainNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    types: new TypedefTranspiler(this.compiler),
    init: new TypeInitTranspiler(this.compiler),
    construct: new TypeConstructorTranspiler(this.compiler),
    uses: new UseTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      const {%identifier%} = (() => {
        {%*uses%}
        {%*types%}
      
        const I{%identifier%} = {
          {%*init%},
        };
      
        return {
          {%*construct%},
        };
      })();
    `;
  }

  public resolve(data: DomainNode, key: string): any {
    switch (key) {
      case 'names':
        return Object.keys(data.types);

      case 'init' :
        return this.values(data.types);

      case 'construct':
        return this.values(data.types);
    }

    return super.resolve(data, key);
  }
}

export class TypeInitTranspiler extends AbstractTranspiler<TypeDefNode> {
  protected get code(): string {
    return `{%lower%}: intent.type({%name%})`;
  }

  public resolve(data: TypeDefNode, key: string): any {
    switch (key) {
      case 'lower': return data.name.toLowerCase();
    }

    return super.resolve(data, key);
  }
}

export class TypeConstructorTranspiler extends AbstractTranspiler<TypeDefNode> {
  protected get code(): string {
    return `{%name%}: intent.constructor(I{%domain%}.{%lower%})`;
  }

  public resolve(data: TypeDefNode, key: string): any {
    switch (key) {
      case 'lower': return data.name.toLowerCase();
      case 'domain': return data.domain.identifier;
    }

    return super.resolve(data, key);
  }
}
