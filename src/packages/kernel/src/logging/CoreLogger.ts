import { Logger } from '@intent/utils';

import { BaseCoreEvent } from '../event';

export class CoreLogger extends Logger {
    public classify(klass: string, args: any[]): [string, string, any[]] {
        const event = args[0];

        return (
            (event instanceof BaseCoreEvent)
                ? super.classify(event.type, args.slice(1))
                : super.classify(klass, args)
        );
    }
}
