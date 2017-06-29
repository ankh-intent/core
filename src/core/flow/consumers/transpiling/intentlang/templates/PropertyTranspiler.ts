
import { AbstractTranspiler } from './AbstractTranspiler';
import { PropertyNode } from '../../../../../intent/ast/PropertyNode';

export class PropertyTranspiler extends AbstractTranspiler<PropertyNode> {
  public get code(): string {
    return `{%name%}/*: {%type%}*/`;
  }
}
