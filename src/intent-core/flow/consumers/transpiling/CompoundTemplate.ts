
import { TemplateInterface } from './compiler/TemplateInterface';
import { Strings } from '../../../../intent-utils/Strings';

export declare type Templateable<S, R> = string|TemplateInterface<S, R>;

export class CompoundTemplate<S, R> implements TemplateInterface<S, R> {
  private lines: Templateable<S, R>[];

  public constructor(lines: Templateable<S, R>[]) {
    this.lines = lines;
  }

  public apply(data: S): R {
    return <any>Strings.fold(
      this.lines.map((line: Templateable<S, R>) => (
        typeof line === 'string'
          ? <any>line
          : line.apply(data)
      ))
    );
  }
}