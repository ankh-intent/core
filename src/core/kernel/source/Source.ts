
import { Range } from '../parser/TokenMatcher';
import { Origin } from './Origin';

export class Source {
  public readonly content: string;
  public readonly reference: any;

  public extract(start: number, end: number): string {
    return this.content.substr(start, end - start);
  }

  public at(index: number): string {
    return this.content.charAt(index);
  }

  public range(): Range {
    return { from: 0, to: this.content.length };
  }

  public location(pos: number): Origin {
    let line = 1;
    let col = 0;
    let i = 0;

    while (i < pos) {
      if (this.at(i++).match(/\n\r?/)) {
        line++;
        col = 0;
      } else {
        col++;
      }
    }

    return new Origin(
      this,
      line,
      col,
    );
  }
}
