/*
                G    G              RR    R
domain MapEntry<Key, Value> extends [Key, Value] {}

           G    G              R        R        R    R
domain Map<Key, Value> extends Iterable<MapEntry<Key, Value>> {
           R           R
  add(key: Key, value: Value): this {
    return this;
  }
}

                G   G            R        RR    R
domain Consumer<In, Out> extends Callable<[In], Out> {}

                      G   R       G            R        R   R
domain NumberConsumer<In: number, Out> extends Consumer<In, Out> {}
 */

import { TreeNode } from '@intent/ast';
import { DomainNode } from '../transpiler/ast';
import { Qualifier } from './reference';

export interface TranslatedInterface<N extends TreeNode> {
  parentNode?: TranslatedInterface<any>;
}

export interface DomainInterface extends TranslatedInterface<DomainNode>, DomainRegistryInterface {
  identifier: string;
  qualifier: Qualifier;
  parent?: ReferenceInterface;
  generics: GenericInterface[];
}

export interface ReferenceInterface {
  domain: DomainInterface; // referenced domain
  generics: ReferenceInterface[]; // referenced domain generic substitutions
}

export interface GenericInterface {
  identifier: string; // template name
  parent?: ReferenceInterface;
  defaultsTo?: ReferenceInterface;
}

export interface DomainRegistryInterface {
  getLocalDomain(qualifier: Qualifier): DomainInterface|undefined;
}
