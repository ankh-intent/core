import { TreeNode } from '@intent/kernel';
import { Translated } from '@intent/translator';
import { TranslatedInterface, DeclarationRegistryInterface, DeclarationInterface } from './interfaces';
import { Qualifier } from './reference';

const makePath = (...parts: (string | null | undefined | false)[]) => parts.filter(Boolean).join('.');

export class DeclarationRegistry<N extends TreeNode> extends Translated<N> implements DeclarationRegistryInterface {
    #_declarations = new Map<string, DeclarationInterface>();

    public static search(node?: TranslatedInterface<any>): DeclarationRegistry<any> | undefined {
        while (node) {
            if (node instanceof this) {
                return node;
            }

            node = node.parentNode;
        }
    }

    public get identifier(): string | null {
        return null;
    }

    public get namespace(): string {
        return makePath(
            DeclarationRegistry.search(this.parentNode)?.namespace,
            this.identifier,
        );
    }

    [Symbol.iterator]() {
        return this.#_declarations.values();
    }

    getDeclaration<D>(qualifier: Qualifier): DeclarationInterface & D {
        const found = this.getLocalDeclaration<D>(qualifier) || (
            this.parentNode && DeclarationRegistry.search(this.parentNode)!.getDeclaration<D>(qualifier)
        );

        if (found) {
            return found;
        }

        throw new Error(`"${qualifier.path()}" not found in ${this.namespace ? ` namespace "${this.namespace}"` : 'global namespace'}`);
    }

    getLocalDeclaration<D>(qualifier: Qualifier): (DeclarationInterface & D) | undefined {
        const declaration = this.getDeclarationByIdentifier<D>(qualifier.name);

        if (declaration && qualifier.child) {
            return declaration.getLocalDeclaration<D>(qualifier.child);
        }

        return declaration;
    }

    getDeclarationByIdentifier<D>(identifier: string): (DeclarationInterface & D) | undefined {
        return this.#_declarations.get(identifier) as (DeclarationInterface & D);
    }

    registerDeclaration(declaration: DeclarationInterface): this {
        if (<any>declaration === this) {
            throw new Error(`Re-declaring "${declaration.identifier}" inside itself`);
        }

        if (this.getDeclarationByIdentifier(declaration.identifier)) {
            throw new Error(`Already have locally declared "${declaration.identifier}"`);
        }

        this.#_declarations.set(declaration.identifier, declaration);

        return this;
    }
}
