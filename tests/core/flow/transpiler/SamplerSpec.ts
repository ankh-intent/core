
import { pit } from '../../../util/spec-extensions';
import { Sampler } from '../../../../src/core/flow/transpiler/templates/compiler/Sampler';

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
      () => ({open: "", close: "", expect: ""}),
    ];

    pit('should return wrapped key', sample1, (data) => {

    });

  });

});
