
import { DomainNode } from '../ast/DomainNode';
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Container } from '../../flow/transpiler/Container';

export class DomainsTranspiler extends AbstractCompoundTemplate<Container<DomainNode>> {
  public get code(): string {
    return `{%*domain%}`;
  }
}
