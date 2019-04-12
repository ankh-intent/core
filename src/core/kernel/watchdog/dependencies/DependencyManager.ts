
import { Container } from '../../../utils/Container';
import { Objects } from '../../../utils/Objects';
import { Chip } from '../../../../../bin/intent/chips/Chip';
import { DependencyNode } from './DependencyNode';
import { Eventable } from '../../../utils/Eventable';

export class DependencyManager extends Eventable {
  static RETAIN = 'retain';
  static RELEASE = 'release';

  public readonly roots: Container<DependencyNode> = {};

  public onretain(handler, once?: boolean): number {
    return (
      once
        ? this.once(DependencyManager.RETAIN, handler)
        : this.on(DependencyManager.RETAIN, handler)
    );
  }

  public onrelease(handler, once?: boolean): number {
    return (
      once
        ? this.once(DependencyManager.RELEASE, handler)
        : this.on(DependencyManager.RELEASE, handler)
    );
  }

  public contains(filter: (nodes: DependencyNode) => boolean): DependencyNode {
    for (const node of Objects.iterate(this.roots)) {
      if (filter(node)) {
        return node;
      }
    }

    return null;
  }

  public find(name: string): DependencyNode {
    for (const root of Objects.iterate(this.roots)) {
      const found = root.related(name);

      if (found) {
        return found;
      }
    }

    return null;
  }

  public add(chip: Chip): DependencyNode {
    const node = this.roots[chip.path]
      ? this.roots[chip.path]
      : this.roots[chip.path] = this.buildNode(chip);

    this.emit(DependencyManager.RETAIN, node);

    return node;
  }

  public dependency(chip: Chip): DependencyNode {
    return this.find(chip.name) || this.add(chip);
  }

  public dependants(chip: Chip): DependencyNode {
    return new DependencyNode(chip);
  }

  protected buildNode(chip: Chip): DependencyNode {
    const node = new DependencyNode(chip);

    node.relate(
      Object.keys(chip.linked)
        .map((name) => this.buildNode(chip.linked[name]))
    );

    return node;
  }

  public all(names: string[] = null, filter: boolean = true): (DependencyNode|string)[] {
    if (!names) {
      return Object.keys(this.roots)
        .map((name) => this.roots[name])
      ;
    }

    const nodes = names.map((name) => this.roots[name]);

    return (
      filter
        ? nodes.filter(Boolean)
        : nodes.map((node, index) => node || names[index])
    );
  }

  public remove(node: DependencyNode): number {
    let released = +(delete this.roots[node.chip.path]);

    for (const root of Objects.iterate(this.roots)) {
      released += +root.release(node);
    }

    for (const dependency of node) {
      this.dereference(node, dependency);
    }

    this.emit(DependencyManager.RELEASE, node);

    return released;
  }

  public dereference(parent: DependencyNode, dependency: DependencyNode): boolean {
    if (!parent.release(dependency)) {
      return false;
    }

    const name = dependency.chip.path;

    for (const root of Objects.iterate(this.roots)) {
      if (root === dependency) {
        continue;
      }

      if (root.related(name)) {
        return false;
      }
    }

    return !!this.remove(dependency);
  }
}
