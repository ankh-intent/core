
import { Source } from '../source/Source';

export class SyntaxError extends Error {
  public source: Source;
  public pos: number;

  public constructor(message: string, source: Source, pos: number) {
    super(message);
    this.source = source;
    this.pos = pos;
  }
}
