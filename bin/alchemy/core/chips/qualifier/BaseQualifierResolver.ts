import * as path from 'path';

import { PathsConfig } from '@intent/CoreConfig';

import { Module } from '../Module';
import { QualifierNode } from '../../transpiler/ast';
import { QualifierResolverInterface } from './QualifierResolverInterface';

export class BaseQualifierResolver implements QualifierResolverInterface {
  protected config: PathsConfig;

  public constructor(config: PathsConfig) {
    this.config = config;
  }

  public resolve(from: Module): QualifierNode|null {
    return this.parse(this.config.project, from.identifier);
  }

  protected parse(base: string, original: string): QualifierNode|null {
    const parts = original
      .substr(base.length)
      .replace(/\.[^.]+$/ig, '')
      .split(path.sep)
      .filter((p) => p.trim() !== '')
      .map((part) => part.substr(0, 1).toUpperCase() + part.substr(1))
    ;

    return parts.reduce(
      (child: QualifierNode|null, id) => new QualifierNode(id, child),
      null,
    );
  }
}
