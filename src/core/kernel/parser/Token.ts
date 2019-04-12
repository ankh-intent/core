
import { Source } from '../source/Source';

export class Token {
  constructor(
    public readonly source: Source,
    public readonly type: string,
    public readonly start: number,
    public readonly end: number,
  ) {
  }

  public get value(): string {
    return (this.type === 'string')
      ? this.source.extract(this.start + 1, this.end - 1)
      : this.source.extract(this.start, this.end);
  }

  public get raw(): string {
    return this.source.extract(this.start, this.end);
  }
}
