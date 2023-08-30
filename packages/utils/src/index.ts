export * from './ArrayConsumer';
export * from './Container';
export * from './Emitter';
export * from './Eventable';
export * from './Logger';
export * from './Strings';
export * from './UnitMatcher';
export * from './StackedQueue';

export const get = (data: any, path: string[]): any => {
    for (const part of path) {
        data = data[part];

        if (!data) {
            break;
        }
    }

    return data;
};
