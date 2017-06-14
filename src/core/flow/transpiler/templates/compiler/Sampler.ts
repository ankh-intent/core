
import { MatchedPlaceholder } from './SamplerInterface';

export class Sampler {
  private opener: string;
  private closer: string;

  public constructor(opener: string, closer: string) {
    if (!(opener && closer)) {
      throw new Error('Open or close sequence not specified');
    }

    if (opener === closer) {
      throw new Error('Open sequence should not match close sequence');
    }

    this.opener = opener;
    this.closer = closer;
  }

  public placeholder(key: string): string {
    return null;
  }

  public next(subject: string, from?: number): MatchedPlaceholder {
    return null;
  }
}
