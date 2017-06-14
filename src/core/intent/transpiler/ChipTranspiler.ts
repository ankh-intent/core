
import { ChipNode } from '../ast/ChipNode';
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';

export class ChipTranspiler extends AbstractCompoundTemplate<ChipNode> {
  public get code(): string {
    return `
      (() => { 
        {%domains%}
        {%can%}
      
        return {
          {%=names%},
        };
      })();
      `;
  }

  public resolve(data: ChipNode, property: string) {
    switch (property) {
      case "names":
        return Object.keys(data.domains);
    }

    return data[property];
  }
}

// export class ChipTranspiler extends AbstractTranspiler<ChipNode> {

  // private sampler: Sampler = new ChipSampler(this.samples);
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
// }
//
// class ChipSampler extends Sampler {
//   public transformers: {
//     chip: Transformer,
//     domain: Transformer,
//     typeref: Transformer,
//     domains: Transformer,
//     typerefs: Transformer,
//   } = <any>{};
//
//   public constructor(compiler: SampleCompiler) {
//     super();
//     this.transformers.domain = compiler.template(this, ,
//
//     this.transformers.chip = compiler.template(this, `
//       (() => {
//         {%domains%}
//         {%can%}
//
//         return {
//           {%{%names%},%}
//         };
//       })();`,
//       (chip: ChipNode) => ({ ...chip, names: Object.keys(chip.domains), })
//     );
//
//     this.transformers.typeref = compiler.template(this,
//       '{%name%}: intent.bind(I.{%lowercase%})',
//       (typedef: TypeDefNode) => ({ ...typedef, lowercase: typedef.name.toLowerCase(), })
//     );
//
//     this.transformers.domains = compiler.container<DomainNode>(this, 'domain');
//
//     this.transformers.typerefs = compiler.container<TypeDefNode>(this, 'typeref');
//   }
// }
