
import { pit } from '../../../util/spec-extensions';

import { Sampler } from '../../../../src/core/flow/transpiler/Sampler';
import { TemplateInterface } from '../../../../src/core/flow/transpiler/templates/compiler/TemplateInterface';
import { Compiler } from '../../../../src/core/flow/transpiler/templates/compiler/Compiler';

describe('Compiler', () => {

  describe('compile()', () => {
    let compiler;

    describe('plain per-line split', () => {
      beforeEach(() => {
        compiler = new Compiler(new Sampler());
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
        () => ({code: "a{b}c", expect: ["a{b}c"]}),
      ];

      pit('should compile empty template to no-op', sample1, (data) => {
        expect(compiler.compile(data.code)).toEqual(data.expect);
      });

      pit('should split code by lines', sample2, (data) => {
        expect(compiler.compile(data.code).length).toEqual(data.expect);
      });

      pit('plaintext should be left as is', sample3, (data) => {
        expect(compiler.compile(data.code)).toEqual(data.expect);
      });

    });

    describe('with placeholders', () => {
      let key1, compiler;

      beforeEach(() => {
        let sampler = new Sampler();
        compiler = new Compiler(sampler);
        key1 = sampler.wrap('key1');
      });


      let sample1 = () => [
        () => ({code: "no", expect: ["no"]}),
        () => ({code: "{ %no%}", expect: ["{ %no%}"]}),
        () => ({code: key1, expect: [jasmine.any(TemplateInterface)]}),
      ];

      pit('should emit template instead of lines with placeholders', sample1, (data) => {
        expect(compiler.compile(data.code)).toEqual(data.expect);
      });

    });

  });

  describe('apply()', () => {

  });

});
