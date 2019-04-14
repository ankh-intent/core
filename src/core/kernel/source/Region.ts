
import { Origin } from './Origin';

export class Region {
  public from: Origin;
  public to: Origin;

  public constructor(from: Origin, to: Origin) {
    this.from = from;
    this.to = to;
  }
}
