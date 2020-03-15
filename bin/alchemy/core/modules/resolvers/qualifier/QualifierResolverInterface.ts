import { Module } from '../../Module';
import { QualifierNode } from '../../../transpiler/ast';

export interface QualifierResolverInterface {
  resolve(from: Module): QualifierNode|null;
}
