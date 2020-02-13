
import { Source } from '@intent/source';

export class SyntaxError extends Error {
  public readonly expectation: string;
  public readonly source: Source;
  public readonly pos: number;
  public readonly parent?: Error;

  public constructor(message: string, expectation: string, source: Source, pos: number, parent?: Error) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.expectation = expectation;
    this.source = source;
    this.pos = pos;
    this.parent = parent;
  }
}
