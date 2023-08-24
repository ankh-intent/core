import { Source } from '../../source';

export class SyntaxError extends Error {
    public readonly expectation: string;
    public readonly source: Source;
    public readonly pos: number;
    public readonly parent?: Error;

    public constructor(message: string, expectation: string, source: Source, pos: number, parent?: Error) {
        const { line, column } = source.location(pos);
        const start = source.position({ line, column: 1 });
        const end = source.position({ line, column: Infinity });
        const extracted = source.extract(start, end).replace(/(^\n+|\n+$)/, '');
        const marker = '^'.padStart(column, ' ');
        const detailed = `${message}:\n${extracted}\n${marker}`;

        super(detailed);
        Object.setPrototypeOf(this, new.target.prototype);
        this.expectation = expectation;
        this.source = source;
        this.pos = pos;
        this.parent = parent;
    }
}
