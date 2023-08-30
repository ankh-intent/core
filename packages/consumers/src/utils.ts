import { sep, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { Strings, get } from '@intent/kernel';

const cwd = process.cwd();
const internal = __dirname.replace(/[\\\/]packages[\\\/][^\\/]+[\\\/]src[\\\/]?.*?$/, sep + 'packages');

export const isInternal = (path?: string) => path?.startsWith(internal);
export const resolveRelative = (path: string) => (path && pathToFileURL(resolve(cwd, path)).toString() || '');
export const resolveUrl = (path: string) => pathToFileURL(path).toString();

const paths = [
    ['identifier'],
    ['reference'],
    ['source', 'reference'],
    ['dependency', 'identifiable', 'uri'],
    ['path'],
];

export const dereference = (data: any) => {
    for (const path of paths) {
        const found = get(data, path);

        if (found) {
            const ref = String(found);

            if (ref) {
                return cut(ref);
            }
        }
    }

    return '';
};
export const cut = (path: string) => {
    const common = Strings.commonPath([cwd, path]);

    return common ? path.slice(common.length + 1) : path;
}

export enum RefType {
    NATIVE,
    AST,
}

export interface ErrorRef {
    type: RefType;
    ref: string;
    source: string;
    combined: number;
    fileName?: string;
}
