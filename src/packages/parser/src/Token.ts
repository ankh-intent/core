import { SourceInterface } from '@intent/source';

export class Token<T = string> {
    constructor(
        public readonly source: SourceInterface,
        public readonly type: T,
        public readonly start: number,
        public readonly end: number,
    ) {
    }

    public get value(): string {
        return (this.type === 'string')
            ? this.source.extract(this.start + 1, this.end - 1)
            : this.raw;
    }

    public get raw(): string {
        return this.source.extract(this.start, this.end);
    }

    public describe(): string {
        return `@${this.type}("${this.value}")`;
    }
}
