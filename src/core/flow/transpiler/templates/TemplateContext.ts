
import { ContextInterface } from '../Context';
import { AbstractTemplate } from './Template';

export class TemplateContext<D, T = string> implements ContextInterface<D, T[]> {
  public code: string;
  public data: D;
  public template: AbstractTemplate<D, T>;

  public constructor(template: AbstractTemplate<D, T>, data: D, code?: string) {
    this.template = template;
    this.code = code;
    this.data = data;
  }

  public apply<K extends keyof D>(ref: K): ContextInterface<D[K], any> {
    if (this.data && this.data.hasOwnProperty(ref)) {
      return new TemplateContext<D[K]>(<any>this.template, this.data[ref], this.code);
    }

    return this;
  }
}
