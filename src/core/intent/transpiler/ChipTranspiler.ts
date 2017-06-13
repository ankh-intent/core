
import { SampleCompiler, Sampler, Template, Transpiler } from '../../flow/transpiler/Transpiler';
import { ChipNode } from '../ast/ChipNode';
import { Container } from '../../flow/transpiler/Container';
import { DomainNode } from '../ast/DomainNode';
import { TypeDefNode } from '../ast/TypeDefNode';
import { CanNode } from '../ast/CanNode';
import { PropertyNode } from '../ast/PropertyNode';

export class ChipTranspiler extends Transpiler<ChipNode, string> {
  private sampler: Sampler = new ChipSampler(this.samples);

  public process(chip: ChipNode) {
    return this.sampler.transformers.chip(chip).join("\n");
  }
//
//   protected types(typedefs: Container<TypeDefNode>): string[] {
//     return this.map(typedefs, (typedef) => this.typedef(typedef));
//   }
//
//   protected typedef(typedef: TypeDefNode): string[] {
//     return this.transform(
//       `
// class {%name%} {
//
// }
// `,
//       {
//         ...typedef,
//       }
//     );
//   }
//
//   protected can(can: CanNode): string[] {
//     return this.transform(
//       `
// {%name%}({%args%}) {
//   {%body%}
// }
// `,
//       {
//         ...can,
//       }
//     );
//   }
//
//   protected args(args: Container<PropertyNode>): string[] {
//     return this.map(args, (arg) => this.arg(arg));
//   }
//
//   protected arg(arg: PropertyNode): string[] {
//     return this.transform(
//       `{%name%}: {%type%}`,
//       {
//         ...arg,
//       }
//     );
//   }
}

class ChipSampler extends Sampler {
  public transformers: {
    chip: Template,
    domain: Template,
    typeref: Template,
    domains: Template,
    typerefs: Template,
  } = <any>{};

  public constructor(compiler: SampleCompiler) {
    super();

    this.transformers.chip = compiler.template(this, `
      (() => {
        {%domains%}
        {%can%}
      
        return {
          {%{%names%},%}
        };
      })();`,
      (chip: ChipNode) => ({ ...chip, names: Object.keys(chip.domains), })
    );

    this.transformers.domain = compiler.template(this, `
      let {%identifier%} = () => {
        {%types%}
      
        const I = {
          ingredient: intent.type(Ingredient),
        };
      
        return {
          {%{%typerefs%},%}
        };
      };`,
      (domain: DomainNode) => ({ ...domain, typerefs: domain.types, })
    );

    this.transformers.typeref = compiler.template(this,
      '{%name%}: intent.bind(I.{%lowercase%})',
      (typedef: TypeDefNode) => ({ ...typedef, lowercase: typedef.name.toLowerCase(), })
    );

    this.transformers.domains = compiler.container<DomainNode>(this, 'domain');

    this.transformers.typerefs = compiler.container<TypeDefNode>(this, 'typeref');
  }
}
