
import * as http from 'http';
import * as express from 'express';
import * as socket from 'socket.io';

import { ClientHub, Client } from './Client';
import { Eventable } from '../intent-utils/Eventable';

export interface ServerOptions {
  port: number;
  web: {
    root: string;
  }
}

export class Server extends Eventable implements ClientHub {
  static READY = 'ready';

  protected app: any;
  private options: ServerOptions;
  private server: http.Server;
  private clients: Client[] = [];

  public constructor(options: ServerOptions) {
    super();
    this.options = options;
  }

  public start() {
    this.server = http.createServer(
      this.buildApp()
    );
    this.buildIO();

    this.app.listen(this.options.port, () => {
      this.emit(Server.READY, this);
    });
  }

  protected buildApp() {
    if (!this.app) {
      this.app = express();

      this.app.get('/', (req, res) => {
        res.redirect('/index.html');
      });
      this.app.use(this.e404.bind(this));
      this.app.use(this.onError.bind(this));
      this.app.use(express.static(this.options.web.root));
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

  public stop(fn) {
    this.server.close(fn);
  }


  protected e404(req, res, next) {
    this.returnPrintout(
      res,
      'Not found',
      `Requested resource can't be found.\n<i>${req.url}</i>`,
      404
    );
  }

  protected onError(err, req, res, next) {
    console.error(err.stack);

    this.returnPrintout(res, 'Internal server error');
  }

  protected returnPrintout(res, title: string, message: string = null, code: number = 500) {
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
      new Client(this, socket)
    );
  }

  public broadcast(data) {
    for (let client of this.clients) {
      client.emit(data);
    }
  }

  public disconnect(client: Client) {

  }

  public event(client: Client, data) {

  }
}
