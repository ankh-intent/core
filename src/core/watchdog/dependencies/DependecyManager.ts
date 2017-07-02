
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
}
