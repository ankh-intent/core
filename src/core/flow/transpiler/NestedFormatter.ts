
import { Formatter } from './Formatter';

export class NestedFormatter implements Formatter {
  private tab: number = 2;

  public format(code: string): string {
    return code
      .trim()
      .split('\n')
      .map((line) => ' '.repeat(this.tab) + line)
      .join('\n')
      ;
  }
}
