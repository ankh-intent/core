
import { MatchedPlaceholder, SamplerInterface } from './compiler/SamplerInterface';

export interface SubstitutorInterface<S, R> {
  substitute(line: string, data: S, consumer: (result: any, match: MatchedPlaceholder, data: S[keyof S]) => any): any;
}

export class Substitutor<S> implements SubstitutorInterface<S, string[]> {
  private sampler: SamplerInterface;

  public constructor(sampler: SamplerInterface) {
    this.sampler = sampler;
  }

  public substitute(line: string, data: S, consumer: (result: any, match: MatchedPlaceholder, data: S[keyof S]) => any): any {
    let seeker = new ReverseSeeker(this.sampler, line);
    let match;
    let result = line;

    while (match = seeker.next()) {
      if (data.hasOwnProperty(match.key)) {
        result = consumer(result, match, data[match.key]);
      } else {
        console.log(data, match.key)
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
