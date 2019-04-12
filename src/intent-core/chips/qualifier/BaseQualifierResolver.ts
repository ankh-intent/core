
import * as path from 'path';

import { TranspilerConfig } from '../../../intent/Transpiler';
import { Chip } from '../Chip';
import { QualifierNode } from '../../../core/consumers/interpreting/intent/ast/QualifierNode';
import { QualifierResolverInterface } from './QualifierResolverInterface';

export class BaseQualifierResolver implements QualifierResolverInterface {
  protected config: TranspilerConfig;

  public constructor(config: TranspilerConfig) {
    this.config = config;
  }

  public resolve(from: Chip): QualifierNode {
    return this.parse(this.config.paths.project, from.path);
  }

  protected parse(base: string, original: string): QualifierNode {
    let parts = original
      .substr(base.length)
      .replace(/\.[^.]+$/ig, '')
      .split(path.sep)
      .filter((p) => p.trim() !== '')
      .map((part) => part.substr(0, 1).toUpperCase() + part.substr(1))
    ;
    let node = null;

    while (parts.length) {
      let child = new QualifierNode();
      child.name = parts.shift();
      child.child = node;
      node = child;
    }

    return node;
  }
}
