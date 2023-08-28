import { TreeNode, Container, Identifiable } from '@intent/kernel';
import { DomainNode, ModuleNode, QualifierNode } from '@alchemy/ast';
import { Qualifier } from './reference';
import { Module } from './Module';

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

export interface UseResolverInterface {
    supports(from: Module, identifier: QualifierNode): boolean;
    resolve(from: Module, identifier: QualifierNode): Module;
}

export interface LinkedModulesResolverInterface<M extends Identifiable<ModuleNode>> {
    resolve(module: M): Container<M>
}
