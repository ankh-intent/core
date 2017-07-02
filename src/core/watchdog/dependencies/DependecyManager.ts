
import { Container } from '../../../intent-utils/Container';
import { Objects } from '../../../intent-utils/Objects';
import { Chip } from '../../chips/Chip';
import { DependencyNode } from './DependencyNode';

export class DependencyManager {
  public roots: Container<DependencyNode> = {};

  public find(name: string): DependencyNode {
    for (let root of Objects.iterate(this.roots)) {
      let found = root.related(name);

      if (found) {
        return found;
      }
    }

    return null;
  }

  public add(chip: Chip): DependencyNode {
    return (
      this.roots[chip.path]
        ? this.roots[chip.path]
        : this.roots[chip.path] = this.buildNode(chip)
    );
  }

  public dependency(chip: Chip): DependencyNode {
    return this.find(chip.name) || this.add(chip);
  }

  public dependants(chip: Chip): DependencyNode {
    return new DependencyNode(chip);
  }

  protected buildNode(chip: Chip): DependencyNode {
    let node = new DependencyNode(chip);

    node.relate(
      Object.keys(chip.linked)
        .map((name) => this.buildNode(chip.linked[name]))
    );

    return node;
  }

  public all(names: string[], filter: boolean = true): (DependencyNode|string)[] {
    let nodes = names.map((name) => this.roots[name]);

    return (
      filter
        ? nodes.filter((node) => node)
        : nodes.map((node, index) => node || names[index])
    );
  }

  public remove(node: DependencyNode): number {
    let released = +(delete this.roots[node.chip.path]);

    for (let root of Objects.iterate(this.roots)) {
      released += root.release(node);
    }

    return released;
  }

  public dereference(parent: DependencyNode, dependency: DependencyNode): boolean {
    if (!parent.release(dependency)) {
      return false;
    }

    let name = dependency.chip.path;

    for (let root of Objects.iterate(this.roots)) {
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
