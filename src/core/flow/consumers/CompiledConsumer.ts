
import { CoreEvent } from '../CoreEvent';
import { CompiledEvent } from '../events/CompiledEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { TreeNodeWalker } from '../../tree/TreeNodeVisitor';
import { Chip } from '../../chips/Chip';

export class CompiledConsumer extends AbstractConsumer<CompiledEvent, any>{
  private nodes: {[path: string]: Chip} = {};

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.bus.stat({
      type: 'synchronize',
      chip,
    });

    let walker = new TreeNodeWalker<Chip>();

    let visitors = {
      chip(node: Chip, { name, queue }: { name: string, queue: {name: string, chip: Chip}[] }) {
        let children = [];

        for (let name in node.linked) {
          walker.walk(node.linked[name], visitors, {
            name,
            queue: children,
          });
        }

        queue.push(...children);

        if (node.path === chip.path) {
          queue.push({
            chip: node,
            name,
          });
        } else {
          if (children.length) {
            queue.push({
              chip: node,
              name,
            });
          }
        }
      },
    };

    let queue = [];
    walker.walk(chip, visitors, {
      name: 'root',
      queue,
    });

    console.log('queue:', queue.map(({ chip, name }) => ({
      name,
      path: chip.path,
    })));

    return event;
  }
}
