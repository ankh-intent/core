
import fs = require('fs');
import { Source } from './Source';
import { StringSource } from './StringSource';

export class FileReader {

  public read(path: string, encoding: string = 'utf8'): Promise<Source> {
    return new Promise((rs, rj) => {
      fs.readFile(path, encoding, function (err, data) {
        return err
          ? rj(err)
          : rs(new StringSource(data));
      });
    });
  }

}
