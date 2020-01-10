
import { Origin } from './Origin';

export class Region {
  public from: Origin;
  public to: Origin;

  public constructor(from: Origin, to: Origin) {
    this.from = from;
    this.to = to;
  }

  extract(): string {
    const source = this.from.source;

    return source.extract(
      source.position(this.from),
      source.position(this.to),
    );
  }
}
