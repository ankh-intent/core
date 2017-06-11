
import { Source } from '../source/Source';

export class Token {
  public source: Source;
  public type: string;
  public start: number;
  public end: number;

  public get value(): string {
    return this.source.extract(this.start, this.end);
  }
}
