
import { pit } from '../../../util/extensions';

import { TemplateInterface } from '../../../../src/core/consumers/interpreting/transpiler/compiler/TemplateInterface';
import { Compiler } from '../../../../src/core/consumers/interpreting/transpiler/compiler/Compiler';
import { Sampler } from '../../../../src/core/consumers/interpreting/transpiler/compiler/Sampler';

describe('PipelineObserver', () => {

  describe('compileLines()', () => {
    let compiler;

    describe('plain per-line split', () => {
      beforeEach(() => {
        compiler = new Compiler(new Sampler('{', '}'));
      });

      let sample1 = () => [
        () => ({code: null, expect: []}),
        () => ({code: "", expect: []}),
      ];

      let sample2 = () => [
        () => ({code: "", expect: 0}),
        () => ({code: "abc\n", expect: 1}),
        () => ({code: "a{b}c\n1\n1", expect: 3}),
        () => ({code: "a{b}c\n\n1", expect: 3}),
        () => ({code: "\n1\n1", expect: 2}),
        () => ({code: "\n1\n1\n\n", expect: 2}),
      ];

      let sample3 = () => [
        () => ({code: "abc", expect: ["abc"]}),
        () => ({code: "a[b]c", expect: ["a[b]c"]}),
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
        let sampler = new Sampler('{%', '%}');
        compiler = new Compiler(sampler, () => new Template());
        key1 = sampler.placeholder('key1');
      });


      let sample1 = () => [
        () => ({code: "no", expect: ["no"]}),
        () => ({code: "{ %no%}", expect: ["{ %no%}"]}),
        () => ({code: key1, expect: [jasmine.any(Template)]}),
      ];

      pit('should emit template instead of lines with placeholders', sample1, (data) => {
        expect(compiler.compileLines(data.code)).toEqual(data.expect);
      });
    });

    describe('factory', () => {
      it('should invoke template factory on template detection', () => {
        let factory = jasmine.createSpy('factory', () => {});
        let sampler = new Sampler('{', '}');
        let resolver = (data, key) => data[key];
        let compiler = new Compiler<any, any>(
          sampler,
          factory
        );

        compiler.compile(sampler.placeholder('key'), resolver);

        expect(factory).toHaveBeenCalled();
      });
    });

    describe('normalization', () => {

      it('should leave as is with no leading space', () => {
        let compiler = new Compiler(null, null);

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
        let compiler = new Compiler(null, null);

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
