
import * as path from 'path';

import { TranspilerConfig } from '../../TranspilerPipelineObserver';
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';
import { QualifierResolverInterface } from './QualifierResolverInterface';

export class BaseQualifierResolver implements QualifierResolverInterface {
  protected config: TranspilerConfig;

  public constructor(config: TranspilerConfig) {
    this.config = config;
  }

  public resolve(from: Chip): QualifierNode {
    return this.parse(this.config.paths.project, from.identifier);
  }

  protected parse(base: string, original: string): QualifierNode {
    const parts = original
      .substr(base.length)
      .replace(/\.[^.]+$/ig, '')
      .split(path.sep)
      .filter((p) => p.trim() !== '')
      .map((part) => part.substr(0, 1).toUpperCase() + part.substr(1))
    ;

    return parts.reduce((child: QualifierNode|null, id) => new QualifierNode(id, child), null);
  }
}
