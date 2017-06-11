
import { Range } from '../parser/Tokens';
export class Source {
  public content: string;
  public reference: any;

  public extract(start: number, end: number): string {
    return this.content.substr(start, end - start);
  }

  public at(index: number): string {
    return this.content.charAt(index);
  }

  public range(): Range {
    return { from: 0, to: this.content.length };
  }
}
