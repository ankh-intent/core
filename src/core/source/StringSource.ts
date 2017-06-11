
import { Source } from './Source';

export class StringSource extends Source {
  public constructor(content: string, reference?: any) {
    super();
    this.content = content;
    this.reference = reference;
  }
}
