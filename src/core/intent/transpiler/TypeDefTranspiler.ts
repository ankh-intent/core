

import { AbstractTranspiler } from '../../flow/transpiler/AbstractTranspiler';
import { TypeDefNode } from '../ast/TypeDefNode';
import { PropertiesTranspiler } from './PropertiesTranspiler';
import { CansTranspiler } from './CansTranspiler';

export class TypeDefTranspiler extends AbstractTranspiler<TypeDefNode, string> {
  private properties: PropertiesTranspiler = new PropertiesTranspiler();
  private cans: CansTranspiler = new CansTranspiler();

  public process(typedef: TypeDefNode) {
    return `class ${typedef.name}` +
      (typedef.parent ? ` extends ${typedef.parent.qualifier.path('.')}` : ``) +
      ` {\n` +
      this.nested.format(
        this.properties.process(typedef.properties)
          .map((l) => `public ${l};`)
          .concat(this.cans.process(typedef.can))
          .join("\n")
      ) +
      `\n}`;
  }
}
