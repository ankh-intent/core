
import { TreeNode } from '../../kernel/ast';
import { DependencyNode, Identifiable } from '../../kernel/dependencies/DependencyNode';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';
import { CompiledEvent } from './CompiledEvent';
import { DependencyManager } from '../../kernel/dependencies/DependencyManager';
import { Source } from '../../kernel/source';
import { AnalyzedEvent } from './AnalyzedEvent';

export class CompileStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export interface IdentifiableFactory<N extends TreeNode, T extends Identifiable<N>> {
  create(identifier: string): T;
}

export class AnalyzedConsumer<N extends TreeNode, T extends Identifiable<N>> extends AbstractConsumer<AnalyzedEvent<N>, any>{
  private readonly factory: IdentifiableFactory<N, T>;
  private readonly tree: DependencyManager<N, T>;

  public constructor(bus: CoreEventBus, factory: IdentifiableFactory<N, T>, tree: DependencyManager<N, T>) {
    super(bus);
    this.tree = tree;
    this.factory = factory;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === AnalyzedEvent.type();
  }

  public process(event: AnalyzedEvent<N>) {
    const { source, ast } = event.data;
    this.stat(event, new CompileStat(source));

    const node = this.tree.find(source.reference) || (
      this.tree.dependency(
        this.factory.create(source.reference),
      )
    );

    return new CompiledEvent({
      dependency: this.patchAST(node, ast),
    });
  }

  protected patchAST(node: DependencyNode<N, T>, ast: N): DependencyNode<N, T> {
    // todo: real patching
    node.identifiable.ast = ast;
    return node;
  }
}
