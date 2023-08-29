import { readFile } from 'node:fs/promises';

import { SourceInterface } from './interfaces';
import { StringSource } from './StringSource';

export class FileReader {
    public async read(path: string, encoding: BufferEncoding = 'utf8'): Promise<SourceInterface> {
        return new StringSource(
            await readFile(path, { encoding }),
            path,
        );
    }
}
