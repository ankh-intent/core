import { TreeNode } from '@intent/ast';
import { PatchedASTEvent } from '@intent/consumers';
import { Scope, PluginEnvironment } from '@intent/plugins';

import { Translated, DeclarationRegistry, Domain, Qualifier, TranslatedConstructor, TranslatedFactory } from '../../modules';

interface SerializingScopeInterface<P> {
  parent: P;
}

interface Spawn<T extends Translated<any>> {
  node: T;
  context: TranslationContext<T>;
}

export class TranslationContext<P extends Translated<any>|undefined> extends Scope<SerializingScopeInterface<P>> {
  public static createContext(env: PluginEnvironment<PatchedASTEvent<any, any>>) {
    return new this<any>({
      parent: (
        (new DeclarationRegistry())
          .registerDeclaration(Domain.create((domain) => ({
            qualifier: Qualifier.create(domain, {
              name: 'Number',
            }),
          })))
          .registerDeclaration(Domain.create((domain) => ({
            qualifier: Qualifier.create(domain, {
              name: 'Boolean',
            }),
          })))
          .registerDeclaration(Domain.create((domain) => ({
            qualifier: Qualifier.create(domain, {
              name: 'String',
            }),
          })))
          .registerDeclaration(Domain.create((domain) => ({
            qualifier: Qualifier.create(domain, {
              name: 'Set',
            }),
          })))
          .registerDeclaration(Domain.create((domain) => ({
            qualifier: Qualifier.create(domain, {
              name: 'Map',
            }),
          })))
          .registerDeclaration(Domain.create((domain) => ({
            qualifier: Qualifier.create(domain, {
              name: 'Array',
            }),
          })))
          .registerDeclaration(Domain.create((domain) => ({
            qualifier: Qualifier.create(domain, {
              name: 'Callable',
            }),
          })))
      ),
    });
  }

  nest<C extends Translated<any>>(data?: Partial<SerializingScopeInterface<C>>): TranslationContext<C> {
    return <TranslationContext<C>>super.nest(data);
  }

  spawn<N extends TreeNode, I extends Translated<N>>(klass: TranslatedConstructor<I>, node: N, factory?: TranslatedFactory<I>): Spawn<I> {
    const spawned = klass.create(node, this.parent, factory);

    return {
      node: spawned,
      context: this.nest({
        parent: spawned,
      }),
    };
  }

  get parent(): P {
    return this.get('parent')!;
  }
}
