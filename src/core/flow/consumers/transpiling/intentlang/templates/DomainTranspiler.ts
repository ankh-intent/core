
import { AbstractTranspiler } from './AbstractTranspiler';
import { DomainNode } from '../../../../../intent/ast/DomainNode';
import { TypedefTranspiler } from './TypedefTranspiler';
import { TypeDefNode } from '../../../../../intent/ast/TypeDefNode';
import { UseTranspiler } from './UseTranspiler';

export class DomainTranspiler extends AbstractTranspiler<DomainNode> {
  private typedef = new TypedefTranspiler(this.compiler);
  private init = new TypeInitTranspiler(this.compiler);
  private construct = new TypeConstructorTranspiler(this.compiler);
  private use = new UseTranspiler(this.compiler);

  protected get code(): string {
    return `
      let {%identifier%} = () => {
        {%uses%}
        {%typedefs%}
      
        const I{%identifier%} = {
          {%init%},
        };
      
        return {
          {%construct%},
        };
      };
    `;
  }

  public resolve(data: DomainNode, key: string): any {
    switch (key) {
      case 'uses':
        console.log(data.uses);
        return Object.keys(data.uses)
          .map((name) => this.use.transpile(data.uses[name]))
        ;
      case 'names': return Object.keys(data.types);

      case 'typedefs':
        return Object.keys(data.types)
          .map((name) => this.typedef.transpile(data.types[name]))
        ;

      case 'init':
        return Object.keys(data.types)
          .map((name) => this.init.transpile(data.types[name]))
        ;

      case 'construct':
        return Object.keys(data.types)
          .map((name) => this.construct.transpile(data.types[name]))
        ;
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
