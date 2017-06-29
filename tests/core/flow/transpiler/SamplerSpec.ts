
import { pit } from '../../../util/spec-extensions';
import { Sampler } from '../../../../src/core/flow/consumers/transpiling/compiler/Sampler';

describe('Sampler', () => {

  describe('constructor()', () => {
    let sample1 = () => [
      () => ({open: "", close: "", expect: "Open or close sequence not specified"}),
      () => ({open: "", close: "}", expect: "Open or close sequence not specified"}),
      () => ({open: "{", close: "", expect: "Open or close sequence not specified"}),
      () => ({open: "{", close: "{", expect: "Open sequence should not match close sequence"}),
    ];

    pit("should throw on invalid opener/closer", sample1, (data) => {
      expect(() => new Sampler(data.open, data.close)).not.toThrow(data.expect);
    });
  });

  describe('placeholder()', () => {
    let sample1 = () => [
      () => ({open: "{", close: "}", key: "", expect: new Error("Invalid key for placeholder")}),
      () => ({open: "{", close: "}", key: "{", expect: new Error("Key for placeholder should not occur in open/close sequences")}),
      () => ({open: "{", close: "}", key: "}", expect: new Error("Key for placeholder should not occur in open/close sequences")}),
    ];

    let sample2 = () => [
      () => ({open: "{", close: "}", key: "a", expect: "{a}"}),
      () => ({open: "^", close: "$", key: ".", expect: "^.$"}),
    ];

    pit('should throw on invalid key', sample1, (data) => {
      let sampler = new Sampler(data.open, data.close);

      expect(() => sampler.placeholder(data.key)).toThrow(data.expect);
    });

    pit('should return wrapped key', sample2, (data) => {
      let sampler = new Sampler(data.open, data.close);

      expect(sampler.placeholder(data.key)).toEqual(data.expect);
    });

  });

  describe('next()', () => {
    let opener = '{', closer = '}';
    let sampler: Sampler;

    beforeEach(() => {
      sampler = new Sampler(opener, closer);
    });

    let sample1 = () => [
      () => ({line: null, expect: null}),
      () => ({line: "non-placeholder", expect: null}),
      () => ({line: "non-{placeholder", expect: null}),
      () => ({line: "non-place}holder", expect: null}),
      () => ({line: "non-}place{holder", expect: null}),
      () => ({line: "non-}place{holder", expect: null}),
    ];

    let sample2Gen = (line, key) => {
      let placeholder = sampler.placeholder(key);
      let generated = line.replace('$1', placeholder);

      return {
        line: generated,
      };
    };

    let sample3Gen = (line, key) => {
      let placeholder = sampler.placeholder(key);
      let generated = line.replace('$1', placeholder);

      return {
        line: generated,
        expect: {
          key  : key,
          open : line.indexOf('$1'),
          close: line.indexOf('$1') + placeholder.length,
        }
      };
    };

    let sample2 = () => [
      () => sample2Gen(`$1`, 'placeholder'),
      () => sample2Gen(`text $1 text`, 'placeholder'),
      () => sample2Gen(`$1 text text`, 'placeholder'),
      () => sample2Gen(`text text $1`, 'placeholder'),
    ];

    let sample3 = () => [
      () => sample3Gen(`te${opener}xt $1 text`, 'placeholder'),
      () => sample3Gen(`text $1 te${opener}xt`, 'placeholder'),
      () => sample3Gen(`te${opener}xt $1 te${closer}xt`, 'placeholder'),
    ];

    pit('should return void on input without placeholders', sample1, (data) => {
      expect(sampler.next(data.line)).toBeFalsy();
    });

    pit('should return match if placeholder is present in line', sample2, (data) => {
      expect(sampler.next(data.line)).toBeTruthy();
    });

    pit('should return placeholder and it`s position in line', sample3, (data) => {
      expect(sampler.next(data.line)).toEqual(jasmine.objectContaining(data.expect));
    });

    pit('should return innermost placeholder', sample3, (data) => {
      expect(sampler.next(data.line)).toEqual(jasmine.objectContaining(data.expect));
    });

  });

  describe('prev()', () => {
    let opener = '{', closer = '}';
    let sampler: Sampler;

    beforeEach(() => {
      sampler = new Sampler(opener, closer);
    });

    let sample1 = () => [
      () => ({line: null, expect: null}),
      () => ({line: "non-placeholder", expect: null}),
      () => ({line: "non-{placeholder", expect: null}),
      () => ({line: "non-place}holder", expect: null}),
      () => ({line: "non-}place{holder", expect: null}),
      () => ({line: "non-}place{holder", expect: null}),
    ];

    let sample2Gen = (line, key) => {
      let placeholder = sampler.placeholder(key);
      let generated = line.replace('$1', placeholder);

      return {
        line: generated,
      };
    };

    let sample3Gen = (line, key) => {
      let placeholder = sampler.placeholder(key);
      let generated = line.replace('$1', placeholder);

      return {
        line: generated,
        expect: {
          key  : key,
          open : line.indexOf('$1'),
          close: line.indexOf('$1') + placeholder.length,
        }
      };
    };

    let sample2 = () => [
      () => sample2Gen(`$1`, 'placeholder'),
      () => sample2Gen(`text $1 text`, 'placeholder'),
      () => sample2Gen(`$1 text text`, 'placeholder'),
      () => sample2Gen(`text text $1`, 'placeholder'),
    ];

    let sample3 = () => [
      () => sample3Gen(`te${opener}xt $1 text`, 'placeholder'),
      () => sample3Gen(`text $1 te${opener}xt`, 'placeholder'),
      () => sample3Gen(`te${opener}xt $1 te${closer}xt`, 'placeholder'),
    ];

    pit('should return void on input without placeholders', sample1, (data) => {
      expect(sampler.prev(data.line)).toBeFalsy();
    });

    pit('should return match if placeholder is present in line', sample2, (data) => {
      expect(sampler.prev(data.line)).toBeTruthy();
    });

    pit('should return placeholder and it`s position in line', sample3, (data) => {
      expect(sampler.prev(data.line)).toEqual(jasmine.objectContaining(data.expect));
    });

    pit('should return innermost placeholder', sample3, (data) => {
      expect(sampler.prev(data.line)).toEqual(jasmine.objectContaining(data.expect));
    });

  });

});
