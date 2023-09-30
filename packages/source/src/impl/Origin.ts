import { inspect } from 'node:util';
import { OriginInterface, SourceInterface } from '../interfaces';

export class Origin implements OriginInterface {
    public source: SourceInterface;
    public line: number;
    public column: number;

    public constructor(source: SourceInterface, line: number, column: number) {
        this.source = source;
        this.line = line;
        this.column = column;
    }

    toString() {
        return `${this.source.reference}:${this.line}:${this.column}`;
    }

    [inspect.custom]() {
        return {
            line: this.line,
            column: this.column,
        };
    }
}
