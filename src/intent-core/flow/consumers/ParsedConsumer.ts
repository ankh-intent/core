
import { CoreEvent } from '../CoreEvent';
import { CoreEventBus } from '../CoreEventBus';
import { ParsedEvent } from '../events/ParsedEvent';
import { AbstractConsumer } from '../AbstractConsumer';
import { CompiledEvent } from '../events/CompiledEvent';
import { Chip } from '../../chips/Chip';
import { ChipNode } from '../../intent/ast/ChipNode';
import { DependencyManager } from '../../watchdog/dependencies/DependencyManager';

export class ParsedConsumer extends AbstractConsumer<ParsedEvent<ChipNode>, any>{
  private tree: DependencyManager;

  public constructor(bus: CoreEventBus, tree: DependencyManager) {
    super(bus);
    this.tree = tree;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ParsedEvent.type();
  }

  public process(event: ParsedEvent<ChipNode>) {
    let { source, ast } = event.data;
    this.stat(event, {
      type: 'compile',
      path: source,
    });

    let chip;
    let node = this.tree.find(source.reference);

    if (node) {
      chip = node.chip;
    } else {
      chip = new Chip(source.reference);
      node = this.tree.dependency(chip);
    }

    chip.name = ast.name;
    chip.ast = this.patchAST(chip, ast);

    return new CompiledEvent({
      dependency: node,
    });
  }

  protected patchAST(chip: Chip, ast: ChipNode) {
    // todo: real patching
    return ast;
  }
}
