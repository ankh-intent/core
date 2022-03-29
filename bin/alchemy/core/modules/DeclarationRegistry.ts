import { TreeNode } from '@intent/ast';
import { TranslatedInterface, DeclarationRegistryInterface, DeclarationInterface } from './interfaces';
import { Qualifier } from './reference';
import { Translated } from './Translated';

export class DeclarationRegistry<N extends TreeNode> extends Translated<N> implements DeclarationRegistryInterface {
  private _declarations = new Map<string, DeclarationInterface>();

  public static search(node?: TranslatedInterface<any>): DeclarationRegistry<any>|undefined {
    while (node) {
      if (node instanceof this) {
        return node;
      }

      node = node.parentNode;
    }
  }

  public get identifier(): string|null {
    return null;
  }

  public get namespace() {
    return [DeclarationRegistry.search(this.parentNode)?.namespace, this.identifier].filter(Boolean).join('.');
  }

  [Symbol.iterator]() {
    return this._declarations.values();
  }

  getDeclaration(qualifier: Qualifier): DeclarationInterface|undefined {
    const found = this.getLocalDeclaration(qualifier) || (
      this.parentNode && DeclarationRegistry.search(this.parentNode)!.getDeclaration(qualifier)
    );

    if (found) {
      return found;
    }

    throw new Error(`"${qualifier.path()}" not found in ${this.namespace ? ` namespace "${this.namespace}"` : 'global namespace'}`);
  }

  getLocalDeclaration(qualifier: Qualifier): DeclarationInterface|undefined {
    const domain = this.getDeclarationByIdentifier(qualifier.name);

    if (domain && qualifier.child) {
      return domain.getLocalDeclaration(qualifier.child);
    }

    return domain;
  }

  getDeclarationByIdentifier(identifier: string): DeclarationInterface|undefined {
    return this._declarations.get(identifier);
  }

  registerDeclaration(declaration: DeclarationInterface): this {
    if (<any>declaration === this) {
      throw new Error(`Re-declaring "${declaration.identifier}" inside itself`);
    }

    if (this.getDeclarationByIdentifier(declaration.identifier)) {
      throw new Error(`Already have locally declared "${declaration.identifier}"`);
    }

    this._declarations.set(declaration.identifier, declaration);

    return this;
  }
}
