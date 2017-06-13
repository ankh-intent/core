
import { Sampler, Transpiler } from '../../flow/transpiler/Transpiler';
import { ChipNode } from '../ast/ChipNode';
import { Container } from '../../flow/transpiler/Container';
import { DomainNode } from '../ast/DomainNode';
import { TypeDefNode } from '../ast/TypeDefNode';
import { CanNode } from '../ast/CanNode';
import { PropertyNode } from '../ast/PropertyNode';

export class ChipTranspiler extends Transpiler<ChipNode, string> {
  private _sampler: Sampler;
  private templators;

  public constructor() {
    super();

    this.templators = {
      chip: this.template(
        '(() => {\n' +
        '  {%domains%}\n' +
        '  {%can%}\n' +
        '\n' +
        '  return {\n' +
        '    {%{%names%},%}\n' +
        '  };\n' +
        '})();',
        (chip: ChipNode) => ({
          ...chip,
          names: Object.keys(chip.domains),
        })),
      domains: this.container<DomainNode>('domain'),
      domain: this.template(
        'let {%identifier%} = () => {\n' +
        '  {%types%}\n' +
        '\n' +
        '  const I = {\n' +
        '    ingredient: intent.type(Ingredient),\n' +
        '  };\n' +
        '\n' +
        '  return {\n' +
        '    {%{%typerefs%},%}\n' +
        '  };\n' +
        '};',
        (domain: DomainNode) => {
          return {
            ...domain,
            // typerefs: this.map(domain.types, (typedef) => this.typeref(typedef)),
          };
        }
      ),
      typerefs: this.container<TypeDefNode>('typeref'),
      typeref: this.template(
        '{%name%}: intent.bind(I.{%lowercase%})',
        (typedef: TypeDefNode) => {
          return {
            ...typedef,
            lowercase: typedef.name.toLowerCase(),
          };
        }
      ),
    };
  }

  protected get sampler() {
    if (!this._sampler) {
      let templates = Object.keys(this.templators);
      let handlers = {};

      for (let name of templates) {
        handlers[name] = ((template) => (...args) => template(...args))(this.templators[name]);
      }

      this._sampler = new Sampler(handlers);
    }

    return this._sampler;
  }

  public process(chip: ChipNode) {
    return this.transform(this.templators.chip, chip).join("\n");
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
