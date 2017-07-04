

export class RoutesCollection {
  public configure(app) {
    app.get('/', (req, res) => {
      res.redirect('/index.html');
    });
  }
}
