
import { Emitter } from '../../../../../intent-utils/Emitter';
import { ArrayConsumer } from '../../../../../intent-utils/ArrayConsumer';
import { Watch } from './Watch';

export class Aggregator<A, H extends ArrayConsumer<A>> {
  private aggregated: A[];

  public readonly delay: number;
  public debounced: {
    emitter: Emitter<H>,
    watch: Watch,
  };

  public constructor(delay: number = 200) {
    this.delay = delay;
    this.aggregated = [];
  }

  public has(): number {
    return this.aggregated.length;
  }

  public stop() {
    if (!this.debounced) {
      return;
    }

    let { watch, emitter } = this.debounced;
    this.debounced = null;

    watch.cancel();
    emitter.off();
  }

  public debounce(): Emitter<H> {
    this.stop();

    let emitter = new Emitter<H>();
    let watch = new Watch(this.submit.bind(this, emitter));

    this.debounced = {
      emitter,
      watch,
    };

    if (this.has()) {
      watch.bounce(this.delay);
    }

    return emitter;
  }

  public aggregate(items: A[]): number {
    if (this.debounced) {
      this.debounced.watch.bounce(this.delay);
    }

    return this.aggregated.push(...items);
  }

  protected submit(emitter: Emitter<H>) {
    let aggregated = this.aggregated;
    this.aggregated = [];

    emitter.emit(aggregated);
  }
}
