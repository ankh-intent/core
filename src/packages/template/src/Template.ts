import { Strings } from '@intent/utils';

import { TemplateInterface } from './TemplateInterface';
import { DataResolver, SubstitutorInterface } from './Substitutor';
import { MatchedPlaceholder } from './SamplerInterface';

export class Template<S> implements TemplateInterface<S, string[]> {
    private readonly substitutor: SubstitutorInterface<S, string[]>;
    private readonly resolver: DataResolver<S>;
    private readonly line: string;

    public constructor(line: string, substitutor: SubstitutorInterface<S, string[]>, resolver: DataResolver<S>) {
        this.line = line;
        this.substitutor = substitutor;
        this.resolver = resolver;
        this.consume = this.consume.bind(this);
    }

    public apply(data: S): string[] {
        return Strings.fold(
            this.substitutor.substitute(
                this.line,
                data,
                this.consume,
                this.resolver,
            ),
        );
    }

    protected consume(lines: string | string[], match: MatchedPlaceholder, data: any): string[] {
        let str: string;

        if (data !== null) {
            if (Array.isArray(data)) {
                return Strings.fold(
                    data.map((item) => this.consume(lines, match, item)),
                );
            }

            if (typeof data === 'object') {
                return Strings.fold(
                    Object.values(data).map((data) => this.consume(lines, match, data)),
                );
            }

            str = String(data);
        } else {
            str = '';
        }

        return (
            (typeof lines === 'string')
                ? [
                    lines.slice(0, match.open) + str + lines.slice(match.close),
                ]
                : lines.map((line: string) => (
                    line.slice(0, match.open) + str + line.slice(match.close)
                ))
        );
    }
}
