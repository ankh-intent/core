import { TemplateInterface } from './TemplateInterface';
import { Sampler } from './Sampler';
import { CompoundTemplate } from './CompoundTemplate';
import { DataResolver } from './Substitutor';

export interface TemplateFactoryInterface<S, R> {
    (code: string, resolver: DataResolver<S>): TemplateInterface<S, R>;
}

export class Compiler<S, R> {
    private readonly sampler: Sampler;
    private readonly factory: TemplateFactoryInterface<S, R> | null;

    public constructor(sampler: Sampler, factory: TemplateFactoryInterface<S, R> | null = null) {
        this.sampler = sampler;
        this.factory = factory;
    }

    public compileLines(code: string, resolver: DataResolver<S>): (string | TemplateInterface<S, R>)[] {
        const cleaned = this.cleanup(code);

        if (!cleaned) {
            return [];
        }

        return cleaned.map((line) => (
            (this.sampler.next(line, 0) && this.factory)
                ? this.factory(line, resolver)
                : line
        ));
    }

    public compile(code: string, resolver: DataResolver<S>): TemplateInterface<S, R> {
        return new CompoundTemplate<S, R>(
            this.compileLines(code, resolver),
        );
    }

    private cleanup(code: string): string[] | void {
        if (!code) {
            return;
        }

        return this.normalize(
            code
                .replace(/(^[\n\r]+|\s+$)/g, '')
                .split('\n')
                .map(String),
        );
    }

    public normalize(lines: string[]): string[] {
        for (const line of lines) {
            if (line.trim() === '') {
                continue;
            }

            const match = line.match(/^(\s+)/);

            if (!match) {
                break;
            }

            const whitespace = match[1];

            return lines.map((line: string) => (
                line.startsWith(whitespace)
                    ? line.substr(whitespace.length)
                    : line
            ));
        }

        return lines;
    }
}
