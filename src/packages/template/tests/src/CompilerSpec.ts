import { pit } from '../util/extensions';

import { TemplateInterface, Compiler, Sampler } from '../../index';

describe('PipelineObserver', () => {

  describe('compileLines()', () => {
    let compiler;

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

      pit('should compile empty template to no-op', sample1, (data) => {
        expect(compiler.compileLines(data.code)).toEqual(data.expect);
      });

      pit('should split code by lines', sample2, (data) => {
        expect(compiler.compileLines(data.code).length).toEqual(data.expect);
      });

      pit('plaintext should be left as is', sample3, (data) => {
        expect(compiler.compileLines(data.code)).toEqual(data.expect);
      });

    });

    describe('with placeholders', () => {
      let key1, compiler;

      class Template implements TemplateInterface<any, any> {
        public apply(data: any): any {
          return undefined;
        }
      }

      beforeEach(() => {
        const sampler = new Sampler('{%', '%}');
        compiler = new Compiler(sampler, () => new Template());
        key1 = sampler.placeholder('key1');
      });


      const sample1 = () => [
        () => ({ code: 'no', expect: ['no'] }),
        () => ({ code: '{ %no%}', expect: ['{ %no%}'] }),
        () => ({ code: key1, expect: [jasmine.any(Template)] }),
      ];

      pit('should emit template instead of lines with placeholders', sample1, (data) => {
        expect(compiler.compileLines(data.code, () => null)).toEqual(data.expect);
      });
    });

    describe('factory', () => {
      it('should invoke template factory on template detection', () => {
        const factory = jasmine.createSpy<() => TemplateInterface<any, any>>('factory', () => ({}) as any);
        const sampler = new Sampler('{', '}');
        const resolver = (data, key) => data[key];
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
        ])).toEqual([
          'a',
          '  b',
          ' c',
        ]);
      });

    });
  });

});
