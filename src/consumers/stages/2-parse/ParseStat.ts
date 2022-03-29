import { Source } from '@intent/source';
import { ConsumerStat } from '../../../kernel';

export class ParseStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}
