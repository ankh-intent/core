
import * as express from 'express';

import { Server, ServerOptions } from './intent-dispatch/Server';
import { RoutesCollection } from './intent-dispatch/RoutesCollection';
import { DependencyManager } from './intent-core/watchdog/dependencies/DependencyManager';
import { DependencyNode } from './intent-core/watchdog/dependencies/DependencyNode';

export class IntentServer extends Server {
  public constructor(tree: DependencyManager, options: ServerOptions) {
    super(options, new IntentRoutesCollection(tree));
  }
}

class IntentRoutesCollection extends RoutesCollection {
  private tree: DependencyManager;

  public constructor(tree: DependencyManager) {
    super();
    this.tree = tree;
  }

  public configure(app) {
    super.configure(app);

    app.use('/nodes', this.nodes());
  }

  protected nodes() {
    return express.Router()
      .get('/', (req, res) => {

        res.status(200).json(
          this.tree
            .all()
            .map((dep: DependencyNode) => {
              return {
                name: dep.chip.name,
                relations: dep.relations().map((dep) => dep.chip.name),
              };
            })
        );
      })
      .get('/:node', (req, res) => {
        res.status(200).json({
          name: req.node.chip.name,
          relations: req.node.relations().map((dep) => dep.chip.name),
        });
      })
      .param('node', (req, res, next, path) => {
        let node = this.tree.contains((node: DependencyNode) => {
          return node.chip.name === path;
        });

        if (node) {
          req.node = node;

          next();
        } else {
          next(new Error(`Dependency node "${path}" not found`));
        }
      })
    ;

  }
}
