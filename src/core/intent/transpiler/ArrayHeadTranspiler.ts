
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Container } from '../../flow/transpiler/Container';

export class ArrayHeadTranspiler extends AbstractCompoundTemplate<Container<any>> {
  public get code(): string {
    return `{%*%}`;
  }

  public resolve(data: Container<any>, property: string) {
    return data[Object.keys(data)[0]];
  }
}
