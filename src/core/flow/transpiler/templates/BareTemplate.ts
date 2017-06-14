
import { AbstractTemplate } from './AbstractTemplate';

export class BareTemplate<D, R = string> extends AbstractTemplate<D, R> {
  public code: string;
  public parent: AbstractTemplate<D, R>;

  public constructor(parent: AbstractTemplate<D, R>, code: string) {
    super(parent.getSubstitutor(), parent.getVisitors());
    this.parent = parent;
    this.code = code;
  }

  public resolve(data: D, property: string) {
    return this.parent.resolve(data, property);
  }
}
