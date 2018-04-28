
import { ArrayConsumer } from '../../../../intent-utils/ArrayConsumer';
import { Emitter } from '../../../../intent-utils/Emitter';
import { Aggregator } from './aggregator/Aggregator';

export class AggregatedEmitter<U, H extends ArrayConsumer<U>> extends Emitter<H> {
  private aggregator: Aggregator<U, H>;

  public constructor(delay: number) {
    super();

    this.aggregator = new Aggregator<U, H>(delay);
    this.aggregator
      .debounce()
      .and(super.emit.bind(this))
    ;
  }

  public emit(items: U[]): number {
    return this.aggregator.aggregate(items), 0;
  }

  public off(uid?: number) {
    if (!uid) {
      this.aggregator.stop();
      this.aggregator = null;
    }

    return super.off(uid);
  }
}
