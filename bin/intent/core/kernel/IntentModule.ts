import { AbstractNode } from '@intent/kernel/ast';
import { Identifiable } from '@intent/kernel/dependencies/DependencyNode';

import { ModuleNode } from '../transpiler/ast';

export class IntentModule extends AbstractNode implements Identifiable<ModuleNode> {
  public name: string;
  public identifier: string;
  public linked: {[name: string]: IntentModule} = {};
  public ast: ModuleNode;

  public constructor(identifier: string) {
    super();
    this.identifier = identifier;
  }

  public link(chip: IntentModule) {
    this.linked[chip.identifier] = chip;
  }

  public unlink(chip: IntentModule) {
    delete this.linked[chip.identifier];
  }

  public has(chip: IntentModule) {
    if (this === chip) {
      return true;
    }

    for (const linked of Object.values(this.linked)) {
      if (linked.has(chip)) {
        return true;
      }
    }

    return false;
  }

  public byPath(path: string): IntentModule|null {
    if (this.identifier === path) {
      return this;
    }

    for (const linked of Object.values(this.linked)) {
      const found = linked.byPath(path);

      if (found) {
        return found;
      }
    }

    return null;
  }
}
