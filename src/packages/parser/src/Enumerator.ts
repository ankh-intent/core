import { SourceInterface, RangeInterface } from '@intent/source';
import { StackedQueue } from '@intent/utils';
import { Token } from './Token';
import { BaseTokenTypes, Context, Tokenizer } from './Tokenizer';

export class Enumerator<TT extends BaseTokenTypes, U> extends StackedQueue<any> {
    private readonly tokenizer: Tokenizer<TT, U>;
    private readonly tokens = new Map<number, Token<TT>>();

    private readonly context: Context;
    private tokenized: number = -1;
    private currentIndex: number;

    public constructor(tokenizer: Tokenizer<TT>, source: SourceInterface, range: RangeInterface) {
        super();
        this.tokenizer = tokenizer;
        this.currentIndex = -1;
        this.context = {
            source,
            range,
            pos: range.from,
        };
    }

    public get source(): SourceInterface {
        return this.context.source;
    }

    public get last(): number {
        const token = this.tokens.get(this.currentIndex + 1);

        return (token && token.start) || this.context.range.from;
    }

    public at(index: number, userData?: any): Token<TT> | null {
        let token = this.tokens.get(index);

        if (!token) {
            if (this.context.pos > this.context.range.to) {
                return null;
            }

            while (this.tokenized < index) {
                token = this.tokenizer(this.context, userData);

                if (token) {
                    this.tokenized++;
                    this.tokens.set(this.tokenized, token);
                } else {
                    break;
                }
            }
        }

        return token || null;
    }

    public next() {
        this.currentIndex++;
    }

    public current(): number {
        return this.currentIndex;
    }

    public goto(index: number): number {
        const old = this.currentIndex;

        if (index >= 0) {
            const token = this.at(index);

            if (!token) {
                throw new Error(`Can't navigate to token #${index}`);
            }
        }

        this.currentIndex = index;

        return old;
    }
}
