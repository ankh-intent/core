import { TreeNode } from '@intent/kernel';
import { DomainNode } from '@alchemy/ast';
import { Qualifier } from './reference';

export interface TranslatedInterface<N extends TreeNode> {
    parentNode?: TranslatedInterface<any>;
}

export interface DeclarationInterface extends DeclarationRegistryInterface {
    identifier: string;
    qualifier: Qualifier;
}

export interface DomainInterface extends TranslatedInterface<DomainNode>, DeclarationInterface {
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

export interface DeclarationRegistryInterface {
    getLocalDeclaration<D>(qualifier: Qualifier): (DeclarationInterface & D) | undefined;
}
