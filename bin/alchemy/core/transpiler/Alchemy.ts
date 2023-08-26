import { SourceInterface, RangeInterface } from '@intent/source';
import { Token, BaseTokenTypes, Context, TokenMatcher } from '@intent/parser';

export class Alchemy {
    public static pure(context: Context, unpure?: boolean) {
        if (unpure) {
            return this.tokenizer(context);
        }

        let token: Token | undefined;

        while ((token = this.tokenizer(context))) {
            if (token.type !== BaseTokenTypes.TK_WHITESPACE) {
                break;
            }
        }

        return token;
    }

    public static tokenizer(context: Context): Token | undefined {
        const was = context.pos;

        if (was >= context.range.to) {
            return;
        }

        const type = this.checkType(context.source, context);

        if (type) {
            return new Token(
                context.source,
                type,
                was,
                context.pos,
            );
        }
    }

    protected static checkType(source: SourceInterface, context: Context): BaseTokenTypes | undefined {
        const index = context.pos;
        const char = source.at(index);

        if (char.match(/['"`]/)) {
            const token = this.checkString(source, context);

            if (token) {
                return token;
            }
        }

        if (char.match(/\s/)) {
            const token = this.checkWhitespace(source, context);

            if (token) {
                return token;
            }
        }

        if (char.match(/\d/)) {
            const token = this.checkNumeric(source, context);

            if (token) {
                return token;
            }
        }

        if (char.match(/[\w_]/i)) {
            const token = this.checkIdentifier(source, context);

            if (token) {
                return token;
            }
        }

        if (char === '/') {
            const token = this.checkComment(source, context);

            if (token) {
                return token;
            }
        }

        return this.checkSymbol(source, context);
    }

    protected static checkWhitespace(source: SourceInterface, context: Context): BaseTokenTypes | undefined {
        let index = context.pos;

        while (source.at(index).match(/\s/)) {
            index++;
        }

        if (index !== context.pos) {
            context.pos = index;

            return BaseTokenTypes.TK_WHITESPACE;
        }
    }

    protected static checkString(source: SourceInterface, context: Context): BaseTokenTypes | undefined {
        let index = context.pos;
        const char = source.at(index++);

        if (!char.match(/['"`]/)) {
            return;
        }

        let at;

        while ((at = source.at(index)) && at !== char) {
            index++;
        }

        if (at === char) {
            context.pos = index + 1;

            return BaseTokenTypes.TK_STRING;
        }
    }

    protected static checkComment(source: SourceInterface, context: Context): BaseTokenTypes | undefined {
        let index = context.pos + 2;

        switch (source.at(context.pos + 1)) {
            case '/': {
                let char: string;

                while ((char = source.at(index)) && (char !== '\n')) {
                    index++;
                }

                context.pos = index;

                return BaseTokenTypes.TK_COMMENT;
            }

            case '*': {
                let char: string;

                while ((char = source.at(index++))) {
                    if ((char === '*') && (source.at(index + 1) === '/')) {
                        context.pos = index + 1;

                        return BaseTokenTypes.TK_COMMENT;
                    }
                }
            }
        }
    }

    protected static checkIdentifier(source: SourceInterface, context: Context): BaseTokenTypes | undefined {
        let index = context.pos;

        while (source.at(index).match(/[\w_]/i)) {
            index++;
        }

        if (index !== context.pos) {
            context.pos = index;

            return BaseTokenTypes.TK_IDENTIFIER;
        }
    }

    protected static checkNumeric(source: SourceInterface, context: Context): BaseTokenTypes | undefined {
        let index = context.pos + 1;

        while (source.at(index).match(/\d/)) {
            index++;
        }

        if (source.at(index) === '.') {
            index++;

            while (source.at(index).match(/\d/)) {
                index++;
            }
        }

        context.pos = index;

        return BaseTokenTypes.TK_NUMBER;
    }

    static multi: { [prop: string]: string[] } = {
        '=': ['>', '='],
        '>': ['='],
        '<': ['='],
        '!': ['='],
        '*': ['*=', '=', '*'],
        '/': ['='],
        '%': ['='],
        '&': ['='],
        '|': ['='],
        '^': ['='],
        '+': ['=', '+'],
        '-': ['=', '-'],
    };

    protected static checkSymbol(source: SourceInterface, context: Context): BaseTokenTypes | undefined {
        const char = source.at(context.pos++);
        const sequences = this.multi[char];

        if (sequences) {
            const probe = source.extract(context.pos, context.pos + 5);

            for (const part of sequences) {
                if (probe.startsWith(part)) {
                    context.pos += part.length;

                    break;
                }
            }
        }

        return BaseTokenTypes.TK_SYMBOL;
    }
}

export class AlchemyTokenMatcher extends TokenMatcher {
    constructor(source: SourceInterface, range: RangeInterface) {
        super(Alchemy.pure.bind(Alchemy), source, range);
    }
}
