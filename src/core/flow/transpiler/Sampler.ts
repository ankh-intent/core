
import { Strings } from '../../../intent-utils/Strings';

export interface KeyMatch {
  line: string;
  key: string;
  open: number;
  close: number;
  next: number;
}

export interface KeyAcceptor {
  line: string;
  next: number|boolean;
}

export class Sampler {
  public opener: string;
  public closer: string;

  public constructor(opener: string = '{%', closer: string = '%}') {
    this.opener = opener;
    this.closer = closer;
  }

  public wrap(key: string): string {
    return this.opener + key + this.closer;
  }

  public match(line: string, consumer: (match: KeyMatch) => KeyAcceptor): string {
    let m, next: number|boolean = 0, r: KeyAcceptor = {line, next};

    while (m = this.next(line, <number>next)) {
      if ((r = consumer(m)) && ({line, next} = r)) {
        if (next !== false) {
          continue;
        }
      }

      break;
    }

    return line;
  }

  public next(line: string, start: number): KeyMatch {
    let found = undefined;
    let open = Strings.lookup(line, start, this.opener);

    while (open >= 0) {
      let inner = Strings.lookup(line, open + this.opener.length, this.opener);
      let close = Strings.lookup(line, open + this.opener.length, this.closer);

      if (close < 0) {
        return;
      }

      if ((inner > 0) && (inner < close)) {
        found = open;
        open = inner;

        continue;
      }

      close += this.closer.length;

      return {
        line,
        open,
        close,
        key: line.substring(open + this.opener.length, close - this.closer.length),
        next: (found === undefined) ? close : found,
      };
    }
  }
}
