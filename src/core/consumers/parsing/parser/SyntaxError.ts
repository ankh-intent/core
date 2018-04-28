
import { Source } from '../../reading/source/Source';

export class SyntaxError extends Error {
  public readonly source: Source;
  public readonly pos: number;
  public parent: Error;

  public constructor(message: string, source: Source, pos: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.source = source;
    this.pos = pos;
  }
}
