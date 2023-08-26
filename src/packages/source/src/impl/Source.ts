import { inspect } from 'node:util';

import { SourceInterface, RangeInterface, OriginInterface, LocationInterface } from '../interfaces';
import { Origin } from './Origin';

export class Source implements SourceInterface {
    public readonly content: string;
    public readonly reference: any;

    public extract(start: number, end: number): string {
        return this.content.slice(start, end);
    }

    public at(index: number): string {
        return this.content.charAt(index);
    }

    public range(): RangeInterface {
        return { from: 0, to: this.content.length };
    }

    public location(pos: number): OriginInterface {
        let line = 1;
        let col = 1;
        let i = 0;

        while (i < pos) {
            if (this.at(i++) === '\n') {
                line++;
                col = 1;
            } else {
                col++;
            }
        }

        return new Origin(
            this,
            line,
            col,
        );
    }

    public position({ line, column }: LocationInterface): number {
        if ((line == 1) && (column == 1)) {
            return 0;
        }

        const len = this.content.length;
        let currentLine = 1;
        let currentCol = 1;
        let i = 0;

        while (i < len) {
            if (this.at(i++) === '\n') {
                currentLine++;
                currentCol = 1;
            } else {
                currentCol++;
            }

            if ((currentLine > line) || ((currentLine === line) && (currentCol > column))) {
                return Math.max(0, i - 1);
            }

            if ((line === currentLine) && (column === currentCol)) {
                return i;
            }
        }

        return len;
    }

    [inspect.custom]() {
        return {
            ...this,
            content: '<...>',
        };
    }
}
