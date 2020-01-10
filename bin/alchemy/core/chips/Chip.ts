import { AbstractNode } from '@intent/kernel/ast/AbstractNode';
import { Identifiable } from '@intent/kernel/dependencies/DependencyNode';

import { ChipNode } from '../transpiler/ast/ChipNode';

export class Chip extends AbstractNode implements Identifiable<ChipNode> {
  public name: string;
  public identifier: string;
  public linked: {[name: string]: Chip} = {};
  public ast: ChipNode;

  public constructor(identifier: string) {
    super();
    this.identifier = identifier;
  }

  public link(chip: Chip) {
    this.linked[chip.identifier] = chip;
  }

  public unlink(chip: Chip) {
    delete this.linked[chip.identifier];
  }

  public has(chip: Chip): boolean {
    if (this === chip) {
      return true;
    }

    for (const name in this.linked) {
      if (this.linked[name].has(chip)) {
        return true;
      }
    }

    return false;
  }

  public byPath(path: string): Chip|null {
    if (this.identifier === path) {
      return this;
    }

    for (const link in this.linked) {
      const found = this.linked[link].byPath(path);

      if (found) {
        return found;
      }
    }

    return null;
  }
}
