import { SourceInterface, Token, BaseTokenTypes, Context } from '@intent/kernel';

const multi: { [prop: string]: string[] } = {
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

export const pure = <TT extends BaseTokenTypes>(context: Context, preserveWhitespace?: boolean): Token<TT> | undefined => {
    if (preserveWhitespace) {
        return tokenizer(context);
    }

    let token: Token<TT> | undefined;

    while ((token = tokenizer(context))) {
        if ((token.type !== BaseTokenTypes.TK_WHITESPACE) && (token.type !== BaseTokenTypes.TK_COMMENT)) {
            break;
        }
    }

    return token;
}

export const tokenizer = <TT extends BaseTokenTypes>(context: Context): Token<TT> | undefined => {
    const was = context.pos;

    if (was >= context.range.to) {
        return;
    }

    const type = checkType(context.source, context) as TT;

    if (type) {
        return new Token(
            context.source,
            type,
            was,
            context.pos,
        );
    }
}

const checkType = <TT extends BaseTokenTypes>(source: SourceInterface, context: Context) => {
    const index = context.pos;
    const char = source.at(index);

    if (char === '\'' || char === '"' || char === '`') {
        const token = checkString(source, context);

        if (token) {
            return token as TT;
        }
    }

    if (char.match(/\s/)) {
        const token = checkWhitespace(source, context);

        if (token) {
            return token;
        }
    }

    if (char.match(/\d/)) {
        const token = checkNumeric(source, context);

        if (token) {
            return token;
        }
    }

    if (char.match(/[\w_]/i)) {
        const token = checkIdentifier(source, context);

        if (token) {
            return token;
        }
    }

    if (char === '/') {
        const token = checkComment(source, context);

        if (token) {
            return token;
        }
    }

    return checkSymbol(source, context);
}

const checkWhitespace = (source: SourceInterface, context: Context): BaseTokenTypes | undefined => {
    let index = context.pos;

    while (source.at(index).match(/\s/)) {
        index++;
    }

    if (index !== context.pos) {
        context.pos = index;

        return BaseTokenTypes.TK_WHITESPACE;
    }
}

const checkString = (source: SourceInterface, context: Context): BaseTokenTypes | undefined => {
    let index = context.pos;
    const char = source.at(index++);

    let at;

    while ((at = source.at(index)) && at !== char) {
        index++;
    }

    if (at === char) {
        context.pos = index + 1;

        return BaseTokenTypes.TK_STRING;
    }
}

const checkComment = (source: SourceInterface, context: Context): BaseTokenTypes | undefined => {
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
                if ((char === '*') && (source.at(index) === '/')) {
                    context.pos = index + 1;

                    return BaseTokenTypes.TK_COMMENT;
                }
            }
        }
    }
}

const checkIdentifier = (source: SourceInterface, context: Context): BaseTokenTypes | undefined => {
    let index = context.pos;

    while (source.at(index).match(/[\w_]/i)) {
        index++;
    }

    if (index !== context.pos) {
        context.pos = index;

        return BaseTokenTypes.TK_IDENTIFIER;
    }
}

const checkNumeric = (source: SourceInterface, context: Context): BaseTokenTypes | undefined => {
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

const checkSymbol = (source: SourceInterface, context: Context): BaseTokenTypes | undefined => {
    const char = source.at(context.pos++);
    const sequences = multi[char];

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
