
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Container } from '../../flow/transpiler/Container';

export class ArrayHeadTranspiler extends AbstractCompoundTemplate<Container<any>> {
  public get code(): string {
    return `{%.0%}`;
  }
}
