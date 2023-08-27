import { MatchedPlaceholder, SamplerInterface } from './SamplerInterface';

export type MatchConsumer<S> = (result: any, match: MatchedPlaceholder, data: S[keyof S]) => any;
export type DataResolver<S, K extends keyof S = keyof S> = (data: S, key: K) => S[K];

export interface SubstitutorInterface<S, R> {
    substitute(line: string, data: S, consumer: MatchConsumer<S>, resolver: DataResolver<S, keyof S>): any;
}

export class Substitutor<S> implements SubstitutorInterface<S, string[]> {
    private readonly sampler: SamplerInterface;

    public constructor(sampler: SamplerInterface) {
        this.sampler = sampler;
    }

    public substitute(line: string, data: S, consumer: MatchConsumer<S>, resolver: DataResolver<S, keyof S>): any {
        const seeker = new Seeker(this.sampler, line);
        let match;
        let result = line;

        while ((match = seeker.next())) {
            const resolved = resolver(data, match.key as keyof S);

            if (undefined !== resolved) {
                result = consumer(result, match, resolved);
            }
        }

        return result;
    }
}

export class Seeker {
    protected readonly sample: (subject: string | null, from?: number) => MatchedPlaceholder | null;
    protected readonly line: string;
    protected current?: MatchedPlaceholder | null = undefined;

    public constructor(sampler: SamplerInterface, line: string, forward?: boolean) {
        this.line = line;
        this.sample = forward ? sampler.next : sampler.prev;
    }

    public seek(): MatchedPlaceholder | null {
        return this.sample(
            this.line,
            this.current?.next
        );
    }

    public next(): MatchedPlaceholder | null {
        let match = this.current;

        if (match === null) {
            return match;
        }

        match = this.seek();

        if (match) {
            if (this.current && this.current.open === match.open) {
                throw new Error('Same');
            }
        } else {
            match = null;
        }

        return this.current = match;
    }
}
