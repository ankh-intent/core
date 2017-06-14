
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Container } from '../../flow/transpiler/Container';

export class ArrayTailTranspiler extends AbstractCompoundTemplate<Container<any>> {
  public get code(): string {
    return `,{%*head%}`;
  }

  public resolve(data: Container<any>, property: string) {
    let keys = Object.keys(data);
    let prop = keys.indexOf(property) + 1;

    return data[keys[prop]];
  }
}
