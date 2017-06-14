
import { TemplateVisitor } from './Visitors';
import { AbstractTemplate } from './Template';
import { TemplateContext } from './TemplateContext';

export class TemplateResolveVisitor<
  D,
  R = string,
  T extends AbstractTemplate<D, R> = AbstractTemplate<D, R>
  > extends TemplateVisitor<D, R, T> {
  private property: string;

  public constructor(template: T, property: string) {
    super(template);
    this.property = property;
  }

  public visit(context: TemplateContext<D, R[]>): R[] {
    return this.template.resolve(context.data, this.property);
  }
}
