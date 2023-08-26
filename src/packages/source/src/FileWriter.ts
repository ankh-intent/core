import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

import { SourceInterface } from './interfaces';

export class FileWriter {
    public async write(source: SourceInterface, encoding: BufferEncoding = 'utf8'): Promise<SourceInterface> {
        await this.assumeDir(path.dirname(source.reference));
        await writeFile(source.reference, source.content, { encoding });

        return source;
    }

    protected async assumeDir(dir: string): Promise<string> {
        await mkdir(dir, { recursive: true });

        return dir;
    };
}
