
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

  public link(name: string, chip: Chip) {
    if (chip) {
      this.linked[name] = chip;
    } else {
      delete this.linked[name];
    }
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
}
