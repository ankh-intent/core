import { Module } from '../../Module';
import { QualifierNode } from '../../../transpiler';

export interface UseResolverInterface {
    supports(from: Module, identifier: QualifierNode): boolean;

    resolve(from: Module, identifier: QualifierNode): Module;
}
