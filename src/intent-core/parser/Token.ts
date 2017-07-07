
import { Source } from '../source/Source';

export class Token {
  public source: Source;
  public type: string;
  public start: number;
  public end: number;

  public get value(): string {
    return (this.type === 'string')
      ? this.source.extract(this.start + 1, this.end - 1)
      : this.source.extract(this.start, this.end);
  }

  public get raw(): string {
    return this.source.extract(this.start, this.end);
  }
}
