import { Identifiable } from '@intent/kernel';
import { Strings } from '@intent/utils';

import { ModuleNode, QualifierNode } from '../transpiler/ast';
import { Domain, Uses } from './domain';
import { DeclarationRegistry } from './DeclarationRegistry';
import { Qualifier } from './reference';

export class Module extends DeclarationRegistry<ModuleNode> implements Identifiable<ModuleNode> {
  public uri: string;
  public qualifier: Qualifier;
  public linked: {[name: string]: Module} = {};
  public domain: Domain;
  public uses: Uses;

  constructor(uri: string, qualifier: Qualifier) {
    super();
    this.uri = uri;
    this.qualifier = qualifier;
  }

  public get identifier() {
    return this.qualifier.path();
  }

  public get children() {
    return [this.ast, ...Object.values(this.linked)];
  }

  toString() {
    return `${this.uses}\nmodule "${this.identifier}" {\n${
      Strings.indent(String(this.domain).split('\n'), '  ').join('\n')
    }\n}`;
  }
}
