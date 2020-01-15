
import { Source } from './Source';
import { FileWriter } from './FileWriter';

export class DummyWriter extends FileWriter {
  public write(source: Source, encoding: string = 'utf8'): Promise<Source> {
    return Promise.resolve(source);
  }
}
