
import { TreeNode } from '../tree/TreeNode';
import { ChipNode } from '../intent/ast/ChipNode';

export class Chip implements TreeNode {
  public static TYPE_CHIP = 'chip';

  public node: string = Chip.TYPE_CHIP;
  public path: string;
  public name: string;
  public linked: {[name: string]: Chip} = {};
  public ast: ChipNode;

  public constructor(path: string) {
    this.path = path;
  }

  public link(chip: Chip) {
    this.linked[chip.path] = chip;
  }

  public unlink(chip: Chip) {
    delete this.linked[chip.path];
  }

  public has(chip: Chip) {
    if (this === chip) {
      return true;
    }

    for (let name in this.linked) {
      if (this.linked[name].has(chip)) {
        return true;
      }
    }

    return false;
  }

  public byPath(path: string): Chip {
    if (this.path === path) {
      return this;
    }

    let found;

    for (let link in this.linked) {
      if (found = this.linked[link].byPath(path)) {
        return found;
      }
    }

    return null;
  }
}
