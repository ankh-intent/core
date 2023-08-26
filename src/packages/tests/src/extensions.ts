import {} from 'jasmine';

export const pit = <D extends Record<string, any>>(text: string, provider: () => (() => D)[], block: (data: D) => void) => {
    const data = provider();

    for (const test of data) {
        it(text, () => block(test()));
    }
};
