
import { TreeNode } from '../../kernel/ast';
import { Identifiable } from '../../kernel/dependencies/DependencyNode';
import { AbstractConsumer, ConsumerStat, CoreEvent, CoreEventBus, ErrorEvent } from '../../kernel/event';
import { InterpretedEvent } from '../interpreting/InterpretedEvent';
import { Source, StringSource, FileWriter } from '../../kernel/source';

export interface FileEmitResolverInterface<N extends TreeNode, T extends Identifiable<N>> {
  resolve(from: T): string|null;
}

export class EmitStat<N extends TreeNode, T extends Identifiable<N>> extends ConsumerStat {
  public constructor(public readonly identifiable: T, public readonly start: number) {
    super();
  }
}

export class EmittedStat<N extends TreeNode, T extends Identifiable<N>> extends EmitStat<N, T> {
  public constructor(
    public readonly identifiable: T,
    public readonly source: Source,
    public readonly start: number,
    public readonly end: number,
    public readonly index: number,
  ) {
    super(identifiable, start);
  }
}

export class InterpretedConsumer<N extends TreeNode, T extends Identifiable<N>> extends AbstractConsumer<InterpretedEvent<N, T>, any>{
  private readonly writer: FileWriter;
  private readonly resolver: FileEmitResolverInterface<N, T>;
  private total: number = 0;

  public constructor(bus: CoreEventBus, resolver: FileEmitResolverInterface<N, T>, writer: FileWriter) {
    super(bus);
    this.resolver = resolver;
    this.writer = writer;
  }

  public supports(event: CoreEvent<any>): boolean {
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
        this.emit(event, false);

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
