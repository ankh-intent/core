
import { Source } from '../source/Source';

export class Token {
  public source: Source;
  public type: string;
  public start: number;
  public end: number;

  public get value(): string {
    if (this.type === 'string') {
      let value = this.source.extract(this.start + 1, this.end - 1);

      return `"${value}"`;
    }

    return this.source.extract(this.start, this.end);
  }
}
