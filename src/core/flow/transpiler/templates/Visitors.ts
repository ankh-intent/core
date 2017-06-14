

import { Visitor } from '../Visitors';
import { AbstractTemplate } from './Template';
import { TemplateContext } from './TemplateContext';

export class TemplateVisitor<D, R = string, T extends AbstractTemplate<D, R> = AbstractTemplate<D, R>> implements Visitor<D, R[]> {
  protected template: T;

  public constructor(template: T) {
    this.template = template;
  }

  public visit(context: TemplateContext<D, R[]>): R[] {
    return this.template.apply(context.data);
  }
}
