
import { ContextInterface } from '../Context';
import { TemplateVisitors } from './TemplateVisitors';

export class TemplateContext<D, T = string[]> implements ContextInterface<D, T> {
  private visitors: TemplateVisitors<D>;
  public code: string;
  public data: D;

  public constructor(visitors: TemplateVisitors<D>, data: D, code?: string) {
    this.visitors = visitors;
    this.code = code;
    this.data = data;
  }

  public apply<K extends keyof D>(ref: K): ContextInterface<D[K], any> {
    if (this.data && this.data.hasOwnProperty(ref)) {
      return new TemplateContext<D[K]>(<any>this.visitors, this.data[ref], this.code);
    }

    return this;
  }
}
