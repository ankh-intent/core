import { SourceInterface } from './interfaces';
import { FileWriter } from './FileWriter';

export class DummyWriter extends FileWriter {
    public write(source: SourceInterface, encoding: string = 'utf8'): Promise<SourceInterface> {
        return Promise.resolve(source);
    }
}
