
import * as express from 'express';
import * as index from 'serve-index';

import { ServerOptions } from './intent-dispatch/ServerOptions';
import { Server } from './intent-dispatch/Server';
import { RoutesCollection } from './intent-dispatch/RoutesCollection';
import { DependencyManager } from './intent-core/watchdog/dependencies/DependencyManager';
import { DependencyNode } from './intent-core/watchdog/dependencies/DependencyNode';
import { Client, ClientHub } from './intent-dispatch/Client';

export class IntentServer extends Server<ServerOptions> {
  public constructor(tree: DependencyManager, options: ServerOptions) {
    super(
      (server: ClientHub, socket: any) => (<IntentServer>server).clientFactory(socket),
      new IntentRoutesCollection(tree),
      options
    );
  }

  protected clientFactory(socket: any): Client {
    return new IntentClient(this, socket);
  }
}

class IntentClient extends Client {
}

class IntentRoutesCollection extends RoutesCollection<ServerOptions> {
  private tree: DependencyManager;

  public constructor(tree: DependencyManager) {
    super();
    this.tree = tree;
  }

  public configure(app, options: ServerOptions) {
    super.configure(app, options);

    app.use('/', index(options.web.root, {
    }));

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
