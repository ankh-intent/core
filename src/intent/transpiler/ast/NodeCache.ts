
import { Chip } from '../../chips/Chip';

export class NodeCache {
  private cache: {[path: string]: Chip} = {};

  public get(path: string): Chip {
    return this.cache[path];
  }

  public set(chip: Chip): Chip {
    this.cache[chip.path] = chip;

    return chip;
  }

  public all(): Chip[] {
    return Object.keys(this.cache).map((key) => this.cache[key]);
  }

  public has(chip: Chip): boolean {
    return !!this.cache[chip.path];
  }
}
