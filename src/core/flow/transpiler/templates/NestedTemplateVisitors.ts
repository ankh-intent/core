
import { TemplateVisitors } from './TemplateVisitors';
import { ContextInterface } from '../Context';

export class NestedTemplateVisitors<D, R> extends TemplateVisitors<D, R> {
  private parent: TemplateVisitors<D, R>;

  public constructor(parent: TemplateVisitors<D, R>) {
    super();
    this.parent = parent;
  }

  public has(name: string): boolean {
    return super.has(name) || this.parent.has(name);
  }

  public visit(name: string, context: ContextInterface<D, R>): R[] {
    return super.has(name)
      ? super.visit(name, context)
      : this.parent.visit(name, context);
  }
}
