
import { pit } from '../../../util/extensions';
import { Sampler } from '../../../../src/core/kernel/compiler';

describe('Sampler', () => {

  describe('constructor()', () => {
    const sample1 = () => [
      () => ({open: "{", close: "}", avoids: "Open or close sequence not specified"}),
      () => ({open: "{", close: "}", avoids: "Open sequence should not match close sequence"}),
      () => ({open: "", close: "", generates: "Open or close sequence not specified"}),
      () => ({open: "", close: "}", generates: "Open or close sequence not specified"}),
      () => ({open: "{", close: "", generates: "Open or close sequence not specified"}),
      () => ({open: "{", close: "{", generates: "Open sequence should not match close sequence"}),
    ];

    pit("should throw on invalid opener/closer", sample1, (data) => {
      if (data.generates) {
        expect(() => new Sampler(data.open, data.close)).toThrowError(data.generates);
      }

      if (data.avoids) {
        expect(() => new Sampler(data.open, data.close)).not.toThrowError(data.avoids);
      }
    });
  });

  describe('placeholder()', () => {
    const sample1 = () => [
      () => ({open: "{", close: "}", key: "", expect: new Error("Invalid key for placeholder")}),
      () => ({open: "{", close: "}", key: "{", expect: new Error("Key for placeholder should not occur in open/close sequences")}),
      () => ({open: "{", close: "}", key: "}", expect: new Error("Key for placeholder should not occur in open/close sequences")}),
    ];

    const sample2 = () => [
      () => ({open: "{", close: "}", key: "a", expect: "{a}"}),
      () => ({open: "^", close: "$", key: ".", expect: "^.$"}),
    ];

    pit('should throw on invalid key', sample1, (data) => {
      const sampler = new Sampler(data.open, data.close);

      expect(() => sampler.placeholder(data.key)).toThrow(data.expect);
    });

    pit('should return wrapped key', sample2, (data) => {
      const sampler = new Sampler(data.open, data.close);

      expect(sampler.placeholder(data.key)).toEqual(data.expect);
    });

  });

  describe('next()', () => {
    const opener = '{', closer = '}';
    let sampler: Sampler;

    beforeEach(() => {
      sampler = new Sampler(opener, closer);
    });

    const sample1 = () => [
      () => ({line: null, expect: null}),
      () => ({line: "non-placeholder", expect: null}),
      () => ({line: "non-{placeholder", expect: null}),
      () => ({line: "non-place}holder", expect: null}),
      () => ({line: "non-}place{holder", expect: null}),
      () => ({line: "non-}place{holder", expect: null}),
    ];

    const sample2Gen = (line, key) => {
      const placeholder = sampler.placeholder(key);
      const generated = line.replace('$1', placeholder);

      return {
        line: generated,
      };
    };

    const sample3Gen = (line, key) => {
      const placeholder = sampler.placeholder(key);
      const generated = line.replace('$1', placeholder);

      return {
        line: generated,
        expect: {
          key  : key,
          open : line.indexOf('$1'),
          close: line.indexOf('$1') + placeholder.length,
        }
      };
    };

    const sample2 = () => [
      () => sample2Gen(`$1`, 'placeholder'),
      () => sample2Gen(`text $1 text`, 'placeholder'),
      () => sample2Gen(`$1 text text`, 'placeholder'),
      () => sample2Gen(`text text $1`, 'placeholder'),
    ];

    const sample3 = () => [
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
    const opener = '{', closer = '}';
    let sampler: Sampler;

    beforeEach(() => {
      sampler = new Sampler(opener, closer);
    });

    const sample1 = () => [
      () => ({line: null, expect: null}),
      () => ({line: "non-placeholder", expect: null}),
      () => ({line: "non-{placeholder", expect: null}),
      () => ({line: "non-place}holder", expect: null}),
      () => ({line: "non-}place{holder", expect: null}),
      () => ({line: "non-}place{holder", expect: null}),
    ];

    const sample2Gen = (line, key) => {
      const placeholder = sampler.placeholder(key);
      const generated = line.replace('$1', placeholder);

      return {
        line: generated,
      };
    };

    const sample3Gen = (line, key) => {
      const placeholder = sampler.placeholder(key);
      const generated = line.replace('$1', placeholder);

      return {
        line: generated,
        expect: {
          key  : key,
          open : line.indexOf('$1'),
          close: line.indexOf('$1') + placeholder.length,
        }
      };
    };

    const sample2 = () => [
      () => sample2Gen(`$1`, 'placeholder'),
      () => sample2Gen(`text $1 text`, 'placeholder'),
      () => sample2Gen(`$1 text text`, 'placeholder'),
      () => sample2Gen(`text text $1`, 'placeholder'),
    ];

    const sample3 = () => [
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
