import { sep } from 'path';
import { startCase } from 'lodash';

import { PathsConfig } from '@intent/CoreConfig';

import { QualifierNode } from '../../../transpiler/ast';
import { QualifierResolverInterface } from './QualifierResolverInterface';

export class BaseQualifierResolver implements QualifierResolverInterface {
    protected config: PathsConfig;
    protected _cache: Map<string, QualifierNode | null> = new Map();

    public constructor(config: PathsConfig) {
        this.config = config;
    }

    public resolve(uri: string): QualifierNode | null {
        return this.parse(this.config.project, uri);
    }

    protected parse(base: string, original: string): QualifierNode | null {
        const key = `${base}:${original}`;
        const has = this._cache.get(key);

        if (has) {
            return has;
        }

        const relative = original.startsWith(base) ? original.slice(base.length) : original;
        const parts = relative
            .replace(/\.[^.]+$/ig, '')
            .split(sep)
            .filter((p) => p.trim() !== '')
            .map(startCase)
        ;

        const node = parts.reverse().reduce(
            (child: QualifierNode | null, id) => new QualifierNode(id, child),
            null,
        );

        this._cache.set(key, node);

        return node;
    }
}
