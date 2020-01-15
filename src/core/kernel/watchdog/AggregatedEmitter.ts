import { ArrayConsumer, Emitter } from '../../utils';
import { Aggregator } from './aggregator/Aggregator';

export class AggregatedEmitter<U, H extends ArrayConsumer<U>> extends Emitter<H> {
  private aggregator: Aggregator<U, H>|null = null;

  public constructor(delay: number) {
    super();

    this.aggregator = new Aggregator<U, H>(delay);
    this.aggregator
      .debounce()
      .and(super.emit.bind(this))
    ;
  }

  public emit(items: U[]): number {
    if (this.aggregator) {
      this.aggregator.aggregate(items);
    }

    return 0;
  }

  public off(uid?: number) {
    if (this.aggregator && !uid) {
      this.aggregator.stop();
      this.aggregator = null;
    }

    return super.off(uid);
  }
}
