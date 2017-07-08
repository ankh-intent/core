
import * as http from 'http';
import * as express from 'express';
import * as socket from 'socket.io';

import { ClientHub, Client, ClientFactory } from './Client';
import { Eventable } from '../intent-utils/Eventable';
import { RoutesCollection } from './RoutesCollection';
import { ServerOptions } from './ServerOptions';

export class Server<O extends ServerOptions> extends Eventable implements ClientHub {
  static READY = 'ready';

  protected app: any;
  private factory: ClientFactory;
  private options: O;
  private server: http.Server;
  private clients: Client[] = [];
  private routes: RoutesCollection<O>;

  public constructor(factory: ClientFactory, routes: RoutesCollection<O>, options: O) {
    super();
    this.factory = factory;
    this.routes = routes;
    this.options = options;
  }

  public start() {
    this.server = http.createServer(
      this.buildApp()
    );
    this.buildIO();

    this.server.listen(this.options.port, () => {
      this.emit(Server.READY, this);
    });
  }

  protected buildApp() {
    if (!this.app) {
      this.app = express();

      this.routes.configure(this.app, this.options);
      this.app.use(express.static(this.options.web.root));
      this.app.use(this.e404.bind(this));
      this.app.use(this.onError.bind(this));
    }

    return this.app;
  }

  protected buildIO() {
    let io = socket(this.server);

    io.on('connection', (client) => {
      this.connect(client);
    });

    return io;
  }

  public stop(fn?: Function) {
    this.server.close(fn);
  }

  protected e404(req, res) {
    this.returnPrintout(
      res,
      'Not found',
      `Requested resource can't be found.\n<i>${req.url}</i>`,
      404
    );
  }

  protected onError(err, req, res) {
    console.error(req.url, err.stack);

    this.returnPrintout(res, 'Internal server error');
  }

  protected returnPrintout(res, title: string, message: string = null, code: number = 500) {
    // todo: more appropriate handler
    res
      .status(code)
      .send(`
        <html>
          <head>
            <title>${code} ${title}</title>
          </head>
          <body>
            <h1>${code} ${title}</h1>
            ${message ? message.split("\n").map((line) => `<p>${line}</p>`).join("\n") : ''}
          </body>
        </html>
      `)
    ;
  }

  protected connect(socket) {
    this.clients.push(
      this.factory(this, socket)
    );
  }

  public broadcast(...data) {
    for (let client of this.clients) {
      client.emit(...data);
    }
  }

  public disconnect(client: Client) {

  }

  public event(client: Client, data) {

  }
}
