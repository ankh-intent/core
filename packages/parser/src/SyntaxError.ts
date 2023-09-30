import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { white, red, blue } from 'colorette';

import { PositionalInterface } from '@intent/source';

export class SyntaxError extends Error {
    public readonly parent?: Error;
    public readonly expectation: string;
    public readonly pos: PositionalInterface;

    public constructor(message: string, expectation: string, pos: PositionalInterface, parent?: Error) {
        super(red(message) + '\n' + SyntaxError.extractDetailedMessage(message, pos));
        this.expectation = expectation;
        this.pos = pos;
        this.parent = parent;
    }

    static extractDetailedMessage(message: string, pos: PositionalInterface): string {
        const extracted = pos.source.line(pos.origin.line);
        const marker = '^'.padStart(pos.origin.column, ' ') + ' ' + message;
        const fileUrl = pathToFileURL(resolve(process.cwd(), String(pos.origin))).toString();

        return `\n${blue(fileUrl)}\n${white(extracted)}\n${red(marker)}`;
    }
}
