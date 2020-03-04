import * as path from 'path';
import * as fs from 'fs';

import { Source } from './Source';

export class FileWriter {
  public write(source: Source, encoding: string = 'utf8'): Promise<Source> {
    return <Promise<Source>>this.assumeDir(path.dirname(source.reference))
      .then(() => new Promise((rs, rj) => {
          fs.writeFile(
            source.reference,
            source.content,
            { encoding },
            (e) => e ? rj(e) : rs(source),
          );
        })
      )
    ;
  }

  protected assumeDir(dir: string): Promise<string> {
    return <Promise<string>>new Promise((rs, rj) => {
      try {
        fs.exists(dir, (exists) => {
          if (exists) {
            return rs(dir);
          }

          this.assumeDir(path.dirname(dir))
            .then(() => {
              fs.mkdir(dir, (e) => e ? rj(e) : rs(dir))
            })
            .catch(rj)
          ;
        });
      } catch (e) {
        rj(e);
      }
    }).catch((e) => {
      if (e instanceof Error) {
        if (e.message.match(/EEXIST/)) {
          return;
        }
      }

      throw e;
    });
  };
}
