import { Identifiable, AbstractNode } from '@intent/kernel';

import { ModuleNode } from '../transpiler/ast';

export class Module extends AbstractNode implements Identifiable<ModuleNode> {
  public name: string;
  public identifier: string;
  public linked: {[name: string]: Module} = {};
  public ast: ModuleNode;

  public constructor(identifier: string) {
    super();
    this.identifier = identifier;
  }

  public get children() {
    return [this.ast, ...Object.values(this.linked)];
  }

  public link(module: Module) {
    this.linked[module.identifier] = module;
  }

  public unlink(module: Module) {
    delete this.linked[module.identifier];
  }

  public has(module: Module): boolean {
    if (this === module) {
      return true;
    }

    for (const linked of Object.values(this.linked)) {
      if (linked.has(module)) {
        return true;
      }
    }

    return false;
  }

  public byPath(path: string): Module|null {
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
