
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Container } from '../../flow/transpiler/Container';
import { PropertyNode } from '../ast/PropertyNode';

export class PropertiesTranspiler extends AbstractCompoundTemplate<Container<PropertyNode>> {
  public get code(): string {
    return `{%*property%}`;
  }
}
