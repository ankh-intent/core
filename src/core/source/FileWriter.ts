
import fs = require('fs');
import { Source } from './Source';

export class FileWriter {
  public write(source: Source, encoding: string = 'utf8'): Promise<any> {
    return new Promise((rs, rj) => {
      fs.writeFile(source.reference, source.content, {encoding: encoding}, function (err) {
        return err
          ? rj(err)
          : rs();
      });
    });
  }

}
