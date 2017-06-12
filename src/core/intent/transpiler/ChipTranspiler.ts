
import { Transpiler } from '../../flow/transpiler/Transpiler';
import { ChipNode } from '../ast/ChipNode';
import { DomainsTranspiler } from './DomainsTranspiler';
import { CanTranspiler } from './CanTranspiler';
import { UsesTranspiler } from './UsesTranspiler';
import { Container } from '../../flow/transpiler/Container';
import { DomainNode } from '../ast/DomainNode';

export class ChipTranspiler extends Transpiler<ChipNode, string> {

  public process(chip: ChipNode) {
    return this.chip(chip).join("\n");

  public chip(chip: ChipNode) {
    let domains = chip.domains;
    let names = Object.keys(domains);

    return this.transform(
`
(() => {
  {%domains%}

  return {
    {%{%names%},%}
  };
})();
`,
      {
        domains,
        names,
      }
    );
  }


  protected domains(domains: Container<DomainNode>): string[] {
    let names = Object.keys(domains);
    let transformed = names.map((name) => this.domain(domains[name]));

    return this.transform(`{%transformed%}`,
      {
        transformed,
      }
    );
  }

  protected domain(domain: DomainNode): string[] {
    return this.transform(
      `
let {%name%} = () => {
  class Ingredient {

  }

  const D = [
    [()]
  ];

  const I = {
    ingredient: intent.type(Ingredient),
  };

  return {
    Ingredient: intent.bind(I.ingredient),
  };
}
`,
      {
        name: domain.identifier,
      }
    )
  }
}
