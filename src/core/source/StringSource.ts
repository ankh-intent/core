
import { Source } from './Source';

export class StringSource extends Source {
  public constructor(content: string) {
    super();
    this.content = content;
  }
}
