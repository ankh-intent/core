import { TranspilerInterface } from '@intent/kernel/transpiler';

import { ModuleNode } from './transpiler/ast';
import { TypescriptSerializer } from './transpiler/serializers/typescript';

export class TypescriptTranspiler implements TranspilerInterface<ModuleNode> {
  serializer = new TypescriptSerializer();

  transpile(data: ModuleNode): string[] {
    return this.serializer.visit(data).split('\n');
  }

  keyed(data: any): string[] {
    return this.transpile(data);
  }
}
