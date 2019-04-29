
import { Source } from '../source/Source';

export class SyntaxError extends Error {
  public readonly source: Source;
  public readonly pos: number;
  public readonly parent?: Error;

  public constructor(message: string, source: Source, pos: number, parent?: Error) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.source = source;
    this.pos = pos;
    this.parent = parent;
  }
}
