
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';
import { CompiledEvent } from './CompiledEvent';
import { Chip } from '../../../intent/chips/Chip';
import { ChipNode } from '../../../intent/transpiler/ast/ChipNode';
import { DependencyManager } from '../../kernel/watchdog/dependencies/DependencyManager';
import { QualifierResolver } from '../../../intent/chips/qualifier/QualifierResolver';
import { Source } from '../../kernel/source/Source';
import { AnalyzedEvent } from './AnalyzedEvent';

export class CompileStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class AnalyzedConsumer extends AbstractConsumer<AnalyzedEvent<ChipNode>, any>{
  private readonly tree: DependencyManager;
  private readonly resolver: QualifierResolver;

  public constructor(bus: CoreEventBus, resolver: QualifierResolver, tree: DependencyManager) {
    super(bus);
    this.tree = tree;
    this.resolver = resolver;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === AnalyzedEvent.type();
  }

  public process(event: AnalyzedEvent<ChipNode>) {
    let { source, ast } = event.data;
    this.stat(event, new CompileStat(source));

    let chip;
    let node = this.tree.find(source.reference);

    if (node) {
      chip = node.chip;
    } else {
      chip = new Chip(source.reference);
      node = this.tree.dependency(chip);
    }

    chip.name = this.resolver.resolve(chip).path('.');
    chip.ast = this.patchAST(chip, ast);

    return new CompiledEvent({ dependency: node });
  }

  protected patchAST(chip: Chip, ast: ChipNode) {
    // todo: real patching
    return ast;
  }
}
