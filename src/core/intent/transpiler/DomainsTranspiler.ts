
import { Transpiler } from '../../flow/transpiler/Transpiler';
import { Container } from '../../flow/transpiler/Container';
import { DomainNode } from "../ast/DomainNode";
import { DomainTranspiler } from './DomainTranspiler';

export class DomainsTranspiler extends Transpiler<Container<DomainNode>, string[]> {
  private domain: DomainTranspiler = new DomainTranspiler();

  public process(domains: Container<DomainNode>) {
    return Object.keys(domains)
      .map((name) => domains[name])
      .map((domain: DomainNode) => this.domain.process(domain))
    ;
  }
}
