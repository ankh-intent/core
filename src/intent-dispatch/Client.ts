export interface ClientHub {
  event(client: Client, data): void;

  disconnect(client: Client): void;
}

export class Client {
  private server: ClientHub;
  private socket: any;

  public constructor(server: ClientHub, socket, namespaces: string[] = []) {
    this.server = server;
    this.socket = namespaces.reduce((socket, namespace) => socket.to(namespace), socket)

    this.socket.on('disconnect', () => {
      this.server.disconnect(this);
    });

    this.socket.on('event', this.server.event.bind(this.server, socket));
  }

  public emit(...args) {
    this.socket.emit(...args);
  }

  public broadcast(...args) {
    this.socket.broadcast(...args);
  }
}
