import { StringSource, FileWriter } from '@intent/source';

import {
  TreeNode, Identifiable,
  AbstractConsumer, CoreEvent, CoreEventBus, ErrorEvent,
  FileEmitResolverInterface,
} from '../../../kernel';
import { InterpretedEvent, EmittedEvent } from '../../flow-events';
import { EmitStat } from './EmitStat';
import { EmittedStat } from './EmittedStat';

export class EmitAfterInterpreting<N extends TreeNode, T extends Identifiable<N>> extends AbstractConsumer<InterpretedEvent<N, T>, any>{
  private readonly writer: FileWriter;
  private readonly resolver: FileEmitResolverInterface<N, T>;
  private total: number = 0;

  public constructor(bus: CoreEventBus, resolver: FileEmitResolverInterface<N, T>, writer: FileWriter) {
    super(bus);
    this.resolver = resolver;
    this.writer = writer;
  }

  public supports(event: CoreEvent): boolean {
    return event.type === InterpretedEvent.type();
  }

  public process(event: InterpretedEvent<N, T>) {
    const { dependency, content } = event.data;
    const start = +new Date();
    this.stat(event, new EmitStat(dependency.identifiable, start));

    const resolved = this.resolver.resolve(dependency.identifiable);
    const source = new StringSource(content, resolved);

    this.writer
      .write(source)
      .then(() => {
        this.emit(new EmittedEvent({ dependency, source }), false);

        this.stat(event, new EmittedStat(
          dependency.identifiable,
          source,
          start,
          +new Date(),
          ++this.total,
        ));
      })
      .catch((error) => {
        this.emit(new ErrorEvent({ error }, event))
      })
    ;
  }
}
