import { TreeNode } from '@intent/ast';
import { DomainInterface, TranslatedInterface, DomainRegistryInterface } from './interfaces';
import { Qualifier } from './reference';
import { Translated } from './Translated';

import * as util from 'util';

export class DomainRegistry<N extends TreeNode> extends Translated<N> {
  private _domains = new Map<string, DomainInterface>();

  public static search(node?: TranslatedInterface<any>): DomainRegistry<any>|undefined {
    while (node) {
      if (node instanceof DomainRegistry) {
        return node;
      }

      node = node.parentNode;
    }
  }

  public get identifier(): string|null {
    return null;
  }

  public get namespace() {
    return [DomainRegistry.search(this.parentNode)?.namespace, this.identifier].filter(Boolean).join('.');
  }

  [Symbol.iterator]() {
    return this._domains.values();
  }

  getDomain(qualifier: Qualifier): DomainInterface|undefined {
    const found = this.getLocalDomain(qualifier) || (
      this.parentNode && DomainRegistry.search(this.parentNode)!.getDomain(qualifier)
    );

    if (found) {
      return found;
    }

    throw new Error(`Domain "${qualifier.path()}" not found in ${this.namespace ? ` namespace "${this.namespace}"` : 'global namespace'}`);
  }

  getLocalDomain(qualifier: Qualifier): DomainInterface|undefined {
    const domain = this.getDomainByIdentifier(qualifier.name);

    if (domain && qualifier.child) {
      return domain.getLocalDomain(qualifier.child);
    }

    return domain;
  }

  getDomainByIdentifier(identifier: string): DomainInterface|undefined {
    return this._domains.get(identifier);
  }

  registerDomain(domain: DomainInterface): this {
    if (<any>domain === this) {
      throw new Error(`Re-declaring domain "${domain.identifier}" inside itself`);
    }

    if (this.getDomainByIdentifier(domain.identifier)) {
      throw new Error(`Already have local domain "${domain.identifier}"`);
    }

    this._domains.set(domain.identifier, domain);

    return this;
  }
}
