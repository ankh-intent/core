
import { Source } from './Source';

export class Origin {
  public source: Source;
  public line: number;
  public column: number;

  public constructor(source: Source, line: number, column: number) {
    this.source = source;
    this.line = line;
    this.column = column;
  }
}
