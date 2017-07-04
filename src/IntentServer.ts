
import * as path from 'path';
import { Server } from './intent-dispatch/Server';

export class IntentServer extends Server {

  protected buildApp() {
    let app = this.app || super.buildApp();

    this.app.get('/projects', (req, res) => {
    });

    return app;
  }

}
