import { QualifierNode } from '@alchemy/ast';
import { Module } from '../../Module';

export interface UseResolverInterface {
    supports(from: Module, identifier: QualifierNode): boolean;

    resolve(from: Module, identifier: QualifierNode): Module;
}
