import { pit } from '@intent/tests';

import { TemplateInterface, Compiler, Sampler } from '../src';

describe('PipelineObserver', () => {

    describe('compileLines()', () => {
        const resolver = <T>(data: T, key: keyof T): any => data[key];
        let compiler: Compiler<any, any>;

        describe('plain per-line split', () => {
            beforeEach(() => {
                compiler = new Compiler(new Sampler('{', '}'));
            });

            const sample1 = () => [
                () => ({ code: null, expect: [] }),
                () => ({ code: '', expect: [] }),
            ];

            const sample2 = () => [
                () => ({ code: '', expect: 0 }),
                () => ({ code: 'abc\n', expect: 1 }),
                () => ({ code: 'a{b}c\n1\n1', expect: 3 }),
                () => ({ code: 'a{b}c\n\n1', expect: 3 }),
                () => ({ code: '\n1\n1', expect: 2 }),
                () => ({ code: '\n1\n1\n\n', expect: 2 }),
            ];

            const sample3 = () => [
                () => ({ code: 'abc', expect: ['abc'] }),
                () => ({ code: 'a[b]c', expect: ['a[b]c'] }),
            ];

            pit<{ code: null | string; expect: string[] }>('should compile empty template to no-op', sample1, (data) => {
                expect(compiler.compileLines(data.code as any, resolver)).toEqual(data.expect);
            });

            pit('should split code by lines', sample2, (data) => {
                expect(compiler.compileLines(data.code, resolver).length).toEqual(data.expect);
            });

            pit('plaintext should be left as is', sample3, (data) => {
                expect(compiler.compileLines(data.code, resolver)).toEqual(data.expect);
            });

        });

        describe('with placeholders', () => {
            let key1: string;
            let compiler: Compiler<any, any>;

            class Template implements TemplateInterface<any, any> {
                private readonly args: any[];

                constructor(...args: any[]) {
                    this.args = args;
                }
                public apply(data: any): any {
                    return { data, args: this.args };
                }
            }

            beforeEach(() => {
                const sampler = new Sampler('{%', '%}');
                compiler = new Compiler(sampler, (...args: any[]) => new Template(...args));
                key1 = sampler.placeholder('key1');
            });


            const sample1 = () => [
                () => ({ code: 'no', expect: ['no'] }),
                () => ({ code: '{ %no%}', expect: ['{ %no%}'] }),
                () => ({ code: key1, expect: [jasmine.any(Template)] }),
            ];

            const sample2 = () => [
                () => ({ data: null, code: 'no', expect: ['no'] }),
                () => ({ data: null, code: '{ %no%}', expect: ['{ %no%}'] }),
                () => ({
                    data: { key1: '_' },
                    code: `a\nb${key1}c\nd`,
                    expect: ['a', { data: { key1: '_' }, args: [`b${key1}c`, resolver] } , 'd'],
                }),
            ];

            pit<{ code: string; expect: any[] }>('should emit template instead of lines with placeholders', sample1, (data) => {
                expect(compiler.compileLines(data.code, resolver)).toEqual(data.expect);
            });

            pit<{ code: string; data: any; expect: any[] }>('should emit template instead of lines with placeholders', sample2, (data) => {
                expect(compiler.compile(data.code, resolver).apply(data.data)).toEqual(data.expect);
            });
        });

        describe('factory', () => {
            it('should invoke template factory on template detection', () => {
                const factory = jasmine.createSpy<() => TemplateInterface<any, any>>('factory', () => ({}) as any);
                const sampler = new Sampler('{', '}');
                const compiler = new Compiler<any, any>(
                    sampler,
                    factory,
                );

                compiler.compile(sampler.placeholder('key'), resolver);

                expect(factory).toHaveBeenCalled();
            });
        });

        describe('normalization', () => {

            it('should leave as is with no leading space', () => {
                const sampler = new Sampler('{', '}');
                const compiler = new Compiler(sampler, null);

                expect(compiler.normalize([
                    'a',
                    '  b',
                    ' c',
                ])).toEqual([
                    'a',
                    '  b',
                    ' c',
                ]);
            });

            it('should remove leading whitespace', () => {
                const sampler = new Sampler('{', '}');
                const compiler = new Compiler(sampler, null);

                expect(compiler.normalize([
                    '  a',
                    '    b',
                    '   c',
                    ' d',
                ])).toEqual([
                    'a',
                    '  b',
                    ' c',
                    'd',
                ]);
            });

            it('should trim leading empty lines', () => {
                const sampler = new Sampler('{', '}');
                const compiler = new Compiler(sampler, null);

                expect(compiler.normalize([
                    '',
                    '  ',
                    '  a',
                    '   c',
                ])).toEqual([
                    '',
                    '',
                    'a',
                    ' c',
                ]);
            });
        });
    });
});
