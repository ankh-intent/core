
import { MatchedPlaceholder, SamplerInterface } from './compiler/SamplerInterface';

export type MatchConsumer<S> = (result: any, match: MatchedPlaceholder, data: S[keyof S]) => any;
export type DataResolver<S, K extends keyof S = keyof S> = (data: S, key: K) => S[K];

export interface SubstitutorInterface<S, R> {
  substitute(line: string, data: S, consumer: MatchConsumer<S>, resolver: DataResolver<S, keyof S>): any;
}

export class Substitutor<S> implements SubstitutorInterface<S, string[]> {
  private sampler: SamplerInterface;

  public constructor(sampler: SamplerInterface) {
    this.sampler = sampler;
  }

  public substitute(line: string, data: S, consumer: MatchConsumer<S>, resolver: DataResolver<S, keyof S>): any {
    let seeker = new ReverseSeeker(this.sampler, line);
    let match, resolved;
    let result = line;

    while (match = seeker.next()) {
      if (undefined !== (resolved = resolver(data, match.key))) {
        result = consumer(result, match, resolved);
      }
    }

    return result;
  }
}

export class Seeker {
  protected sampler: SamplerInterface;
  protected line: string;
  protected current: MatchedPlaceholder;

  public constructor(sampler: SamplerInterface, line: string) {
    this.sampler = sampler;
    this.line = line;
  }

  public seek(): MatchedPlaceholder {
    return this.sampler.next(this.line, this.current ? this.current.next : 0);
  }

  public next(): MatchedPlaceholder|false {
    let match = this.current;

    if (match === null) {
      return match;
    }

    match = this.seek();

    if (match && this.current && this.current.open === match.open) {
      throw new Error('Same');
    }

    if (!match) {
      match = null;
    }

    return this.current = match;
  }
}

export class ReverseSeeker extends Seeker {
  public seek(): MatchedPlaceholder {
    return this.sampler.prev(this.line, this.current ? this.current.next : undefined);
  }
}