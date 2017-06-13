

import { AbstractTemplate, Template } from './Template';
import { Strings } from '../../../../intent-utils/Strings';

export abstract class AbstractCompoundTemplate<D, R = string> extends AbstractTemplate<D, R> {
  private _lines: (string|false)[];
  private sub: {[index: number]: AbstractTemplate<D, R>} = [];

  protected get lines(): (string|false)[] {
    if (!this._lines) {
      this._lines = this.compile(this.code);
    }

    return this._lines;
  }

  public resolve<K extends keyof D>(data: D, property: K): D[K] {
    return data[property];
  }

  protected cleanup(code: string) {
    let optimized = code
      .replace(/(^[\n\r]|\s+$)/, '')
      .split('\n')
      .map(String)
    ;

    return Strings.unindent(optimized);
  }

  protected compile(code: string): (string|false)[] {
    return this
      .cleanup(code)
      .map((line, index) => {
        if ("" === line.trim()) {
          return line;
        }

        if (!this.substitutor.next(line, 0)) {
          return line;
        }

        this.sub[index] = new Template<D, R>(this, line);

        return false;
      })
    ;
  }

  public apply(data: D): R[] {
    return data
      ? this.flatten(
          this.lines
            .map((line, index) => {
              return (line === false)
                ? this.sub[index].apply(data)
                : line;
            })
        )
      : [];
  }
}
