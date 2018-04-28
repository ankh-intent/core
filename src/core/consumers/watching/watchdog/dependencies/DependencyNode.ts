
import { Chip } from '../../../../../intent-core/chips/Chip';

export class DependencyNode implements Iterable<DependencyNode> {
  private _related: DependencyNode[];

  public readonly chip: Chip;

  public constructor(chip: Chip, related: DependencyNode[] = []) {
    this.chip = chip;
    this._related = related;
  }

  public get path(): string {
    return this.chip.path;
  }

  public relations(): DependencyNode[] {
    return this._related;
  }

  public [Symbol.iterator](): IterableIterator<DependencyNode> {
    return this._related[Symbol.iterator]();
  }

  public relate(nodes: DependencyNode[]): DependencyNode[] {
    for (let node of nodes) {
      let index = this._related.indexOf(node);

      if (index < 0) {
        this._related.push(node);
      }
    }

    return nodes;
  }

  public related(name: string): DependencyNode {
    if (this.path === name) {
      return this;
    }

    for (let node of this._related) {
      let found;

      if (found = node.related(name)) {
        return found;
      }
    }

    return null;
  }

  public release(node: DependencyNode): boolean {
    let index = this._related.indexOf(node);

    if (index >= 0) {
      this._related = this._related.filter((e) => e !== node);
    }

    return index >= 0;
  }
}
