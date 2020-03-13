import { Identifiable } from '@intent/kernel';
import { Strings } from '@intent/utils';

import { ModuleNode } from '../transpiler/ast';
import { Domain } from './domain/Domain';
import { DomainRegistry } from './DomainRegistry';
import { Qualifier } from './reference';

export class Module extends DomainRegistry<ModuleNode> implements Identifiable<ModuleNode> {
  public uri: string;
  public qualifier: Qualifier;
  public linked: {[name: string]: Module} = {};
  public domain: Domain;

  constructor(uri: string) {
    super();
    this.uri = uri;
  }

  public get identifier() {
    return this.qualifier.path();
  }

  public get children() {
    return [this.ast, ...Object.values(this.linked)];
  }

  toString() {
    return `\nmodule "${this.identifier}" {\n${Strings.indent(String(this.domain).split('\n'), '  ').join('\n')}\n}`;
  }
}
