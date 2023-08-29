import { Strings } from '@intent/utils';

import { TemplateInterface } from './TemplateInterface';

export declare type Templateable<S, R> = string | TemplateInterface<S, R>;

export class CompoundTemplate<S, R> implements TemplateInterface<S, R> {
    private readonly lines: Templateable<S, R>[];

    public constructor(lines: Templateable<S, R>[]) {
        this.lines = lines;
    }

    public apply(data: S): R {
        return <R>Strings.fold(
            this.lines.map((line: Templateable<S, R>) => (
                typeof line === 'string'
                    ? <any>line
                    : line.apply(data)
            )),
        );
    }
}
