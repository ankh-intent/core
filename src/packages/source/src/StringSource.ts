import { Source } from './impl';

export class StringSource extends Source {
    public constructor(public readonly content: string, public readonly reference: any) {
        super();
    }
}
