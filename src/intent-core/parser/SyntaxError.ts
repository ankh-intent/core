
import { Source } from '../source/Source';

export class SyntaxError extends Error {
  public source: Source;
  public pos: number;
  public parent: Error;

  public constructor(message: string, source: Source, pos: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.source = source;
    this.pos = pos;
  }
}
