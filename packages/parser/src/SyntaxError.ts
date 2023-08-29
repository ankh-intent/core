import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { white, red, blue } from 'colorette';
import { SourceInterface } from '@intent/source';

export class SyntaxError extends Error {
    public readonly expectation: string;
    public readonly source: SourceInterface;
    public readonly pos: number;
    public readonly parent?: Error;

    public constructor(message: string, expectation: string, source: SourceInterface, pos: number, parent?: Error) {
        super(red(message) + '\n' + SyntaxError.extractDetailedMessage(message, source, pos));
        this.expectation = expectation;
        this.source = source;
        this.pos = pos;
        this.parent = parent;
    }

    static extractDetailedMessage(message: string, source: SourceInterface, pos: number): string {
        const origin = source.location(pos);
        const { line, column } = origin;
        const start = source.position({ line, column: 1 });
        const end = source.position({ line, column: Infinity });
        const extracted = source.extract(start, end).replace(/(^\n+|\n+$)/, '');
        const marker = '^'.padStart(column, ' ') + ' ' + message;
        const fileUrl = pathToFileURL(resolve(process.cwd(), String(origin))).toString();

        return `\n${blue(fileUrl)}\n${white(extracted)}\n${red(marker)}`;
    }
}
