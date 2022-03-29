import { TranspilerInterface } from '@intent/kernel';

import { ModuleNode } from './transpiler/ast';
import { TypescriptSerializer, SerializingContext } from './transpiler/serializers';

export class TypescriptTranspiler implements TranspilerInterface<ModuleNode> {
  serializer = new TypescriptSerializer();

  transpile(data: ModuleNode): string[] {
    return this.serializer.visit(data, SerializingContext.createContext()).split('\n');
  }

  keyed(data: any): string[] {
    return this.transpile(data);
  }
}
