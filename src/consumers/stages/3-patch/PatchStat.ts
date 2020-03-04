import { Source } from '@intent/source';
import { ConsumerStat } from '../../../kernel';

export class PatchStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}
