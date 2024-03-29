import { Strings } from '@intent/utils';

import { MatchedPlaceholder, SamplerInterface } from './SamplerInterface';

export class Sampler implements SamplerInterface {
    private readonly opener: string;
    private readonly closer: string;
    private readonly cache: { [key: string]: string } = {};

    public constructor(opener: string, closer: string) {
        if (!(opener && closer)) {
            throw new Error('Open or close sequence not specified');
        }

        if (opener === closer) {
            throw new Error('Open sequence should not match close sequence');
        }

        this.opener = opener;
        this.closer = closer;
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    public placeholder(key: string): string {
        if (!key) {
            throw new Error('Invalid key for placeholder');
        }

        let cached = this.cache[key];

        if (!cached) {
            if (!((this.opener.indexOf(key) < 0) && (this.closer.indexOf(key) < 0))) {
                throw new Error('Key for placeholder should not occur in open/close sequences');
            }

            this.cache[key] = cached = this.opener + key + this.closer;
        }

        return cached;
    }

    public next(subject: string | null, from?: number): MatchedPlaceholder | null {
        if (!subject) {
            return null;
        }

        if (from === undefined) {
            from = 0;
        }

        let found = undefined;
        let open = Strings.lookup(subject, from, this.opener);

        while (open >= 0) {
            let inner = Strings.lookup(subject, open + this.opener.length, this.opener);
            let close = Strings.lookup(subject, open + this.opener.length, this.closer);

            if (close < 0) {
                return null;
            }

            if ((inner > 0) && (inner < close)) {
                found = open;
                open = inner;

                continue;
            }

            close += this.closer.length;

            return {
                open,
                close,
                key: subject.slice(open + this.opener.length, close - this.closer.length),
                next: (found === undefined) ? close : found,
            };
        }

        return null;
    }

    public prev(subject: string | null, from?: number): MatchedPlaceholder | null {
        if (!subject) {
            return null;
        }

        if (from === undefined) {
            from = subject.length;
        }

        let found = undefined;
        let close = Strings.lookback(subject, from, this.closer);

        while (close > this.opener.length) {
            let inner = Strings.lookback(subject, close - 1, this.closer);
            let open = Strings.lookback(subject, close, this.opener);

            if (open < 0) {
                return null;
            }

            if (inner > open) {
                found = close;
                close = inner;

                continue;
            }

            close += this.closer.length;

            return {
                open,
                close,
                key: subject.slice(open + this.opener.length, close - this.closer.length),
                next: (found === undefined) ? open : found,
            };
        }

        return null;
    }
}
