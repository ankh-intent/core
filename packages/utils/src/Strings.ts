import { sep } from 'node:path';

const REGEXP_GUARD = /[|\\{}()[\]^$+*?.]/g;

export class Strings {
    public static escapeRegExp(pattern: string) {
        return pattern.replace(REGEXP_GUARD, '\\$&');
    }

    public static hyphensToWords(text: string) {
        return text.split('-').join(' ');
    }

    public static wordsToCamelCase(text: string) {
        return text.split(' ').map(Strings.ucFirst).join(' ');
    }

    public static camelCaseToHyphenCase(text: string) {
        return text.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }

    public static camelCaseToSnakeCase(text: string) {
        return text.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toLowerCase();
    }

    public static ucFirst(text: string) {
        return text[1].toUpperCase() + text.slice(1);
    }

    public static shrink(string: string, to: number, left: boolean = false) {
        return (string.length > to)
            ? string.slice(0, to - 4) + '...'
            : this.pad(string, to, ' ', left);
    }

    public static pad(string: string, to: number, pattern: string = ' ', left: boolean = false) {
        if (to <= string.length) {
            return string;
        }

        return left
            ? pattern.repeat(to - string.length) + string
            : string + pattern.repeat(to - string.length);
    }

    public static max(strings: string[]): number {
        return strings.reduce((max, line) => Math.max(max, line.length), 0);
    }

    public static longestCommon(strings: string[]): string[] {
        const subcommon = (a: string, b: string) => {
            const l = Math.min(a.length, b.length);
            let i = 0;

            while (i < l && a.charAt(i) === b.charAt(i)) {
                i++;
            }

            return a.substring(0, i);
        };
        const intersect: string[] = [];

        for (const common1 of strings) {
            let subs = new Array(strings.length);
            let i = 0;

            for (const common2 of strings) {
                if (common1 === common2) {
                    continue;
                }

                subs[i++] = subcommon(common1, common2);
            }

            subs = subs.filter((s) => s.length);

            if (subs.length) {
                for (const sub of subs) {
                    if (intersect.indexOf(sub) < 0) {
                        intersect.push(sub);
                    }
                }
            }
        }

        return ((intersect.length > 1) && (intersect.length !== strings.length))
            ? this.longestCommon(intersect)
            : intersect;
    }

    public static lookup(line: string, p: number, s: string) {
        while (p < line.length) {
            p = line.indexOf(s, p);

            if ((p > 0) && (line[p - 1] === '\\')) {
                p++;

                continue;
            }

            return p;
        }

        return -1;
    }

    public static lookback(line: string, p: number, s: string) {
        while (p) {
            p = line.lastIndexOf(s, p);

            if ((p > 0) && (line[p - 1] === '\\')) {
                p--;

                continue;
            }

            return p;
        }

        return -1;
    }

    public static unindent(lines: string[]): string[] {
        const first = lines[0];
        const m = first.match(/^(\s+)/);

        if (m) {
            const tab = m[1];
            const len = tab.length;

            lines = lines.map((line) => (
                line.startsWith(tab)
                    ? line.slice(len)
                    : line
            ));
        }

        return lines;
    }

    public static indent(lines: string[], pad: string): string[] {
        return lines.map((line) => pad + line);
    }

    public static indentStr(str: string, pad: string): string {
        return str.split('\n').map((line) => pad + line).join('\n');
    }

    public static fold(a: (string | string[])[] | string): string[] {
        if (typeof a === 'string') {
            return [a];
        }

        const result: string[] = [];

        for (const element of a) {
            if (Array.isArray(element)) {
                result.push(
                    ...this.fold(element),
                );
            } else {
                result.push(element);
            }
        }

        return result;
    }

    public static stripLeft(subject: string, needle: string): string {
        return (
            (needle && subject.startsWith(needle))
                ? subject.slice(needle.length)
                : subject
        );
    }

    public static stripRight(subject: string, needle: string): string {
        return (
            (needle && subject.endsWith(needle))
                ? subject.slice(0, -needle.length)
                : subject
        );
    }

    public static commonPath(paths: string[]): string {
        return Strings.stripRight(
            Strings.longestCommon(paths).pop() || '',
            sep,
        );
    }

    public static clear(str: string): string {
        return str.length < 12 ? str : (' ' + str).slice(1);
    }
}
