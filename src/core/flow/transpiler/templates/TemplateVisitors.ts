

import { AbstractTemplate } from './Template';
import { TemplateVisitor } from './Visitors';
import { Visitors } from '../Visitors';
import { TemplateResolveVisitor } from './TemplateResolveVisitor';

export class TemplateVisitors
<
  D,
  R = string,
  T extends AbstractTemplate<D, R> = AbstractTemplate<D, R>,
  V extends TemplateVisitor<D, R, T> = TemplateVisitor<D, R, T>
  > extends Visitors<D, R[], V> {

  public bridge(template: T, name: string|string[]): this {
    if (name instanceof Array) {
      for (let n of name) {
        this.bridge(template, n);
      }

      return this;
    }

    return this.register(
      name,
      <any>new TemplateResolveVisitor<D, R, T>(template, name)
    );
  }
}
