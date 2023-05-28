import { Origin } from './Source';

export class Region {
  public from: Origin;
  public to: Origin;

  public constructor(from: Origin, to: Origin) {
    this.from = from;
    this.to = to;
  }

  get source() {
    return this.from.source;
  }

  get position() {
    return this.source.position(this.from);
  }

  extract(): string {
    const source = this.source;

    return source.extract(
      source.position(this.from),
      source.position(this.to),
    );
  }
}
