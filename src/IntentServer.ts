
import { Server, ServerOptions } from './intent-dispatch/Server';
import { RoutesCollection } from './intent-dispatch/RoutesCollection';

export class IntentServer extends Server {

  public constructor(options: ServerOptions) {
    super(options, new IntentRoutesCollection());
  }

  protected buildApp() {
    let app = this.app || super.buildApp();

    this.app.get('/projects', (req, res) => {
    });

    return app;
  }

}

class IntentRoutesCollection extends RoutesCollection {
  public configure(app) {
    super.configure(app);

    app.get('/chips', (req, res, next) => {
      // list
      res.json([
        {
          chip: 'aaa',
        },
        {
          chip: 'bbb',
        },
      ]);
    });

    app.get('/chips/:chip', (req, res, next) => {
      // view
      res.json(
        {
          chip: 'aaa',
        },
      );
    });

  }
}
