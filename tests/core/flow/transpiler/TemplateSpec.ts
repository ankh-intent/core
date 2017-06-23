
import { pit } from '../../../util/spec-extensions';
import { Template } from '../../../../src/core/flow/consumers/transpiling/Template';
import { Sampler } from '../../../../src/core/flow/consumers/transpiling/compiler/Sampler';
import { Substitutor } from '../../../../src/core/flow/consumers/transpiling/Substitutor';

describe('Template', () => {

  describe('constructor()', () => {

  });

  describe('code()', () => {
    it('should return passed code')
  });

  describe('apply()', () => {
    let sampler;
    let substitutor;

    beforeEach(() => {
      sampler = new Sampler('{', '}');
      substitutor = new Substitutor(sampler);
    });

    let sample1 = () => [
      () => ({code: ["a"], data: {}, expected: ["a"]}),
      () => ({code: ["a", "b"], data: {}, expected: ["a", "b"]}),
      () => ({code: ["a{b}c"], data: {}, expected: ["a{b}c"]}),
    ];

    let sample2 = () => [
      () => ({code: ["a{b}c"], data: {b: "d"}, expected: ["adc"]}),
    ];

    let sample3 = () => [
      () => ({code: ["a{b}c"], data: {b: ["d", "e"]}, expected: ["adc", "aec"]}),
    ];

    let sample4 = () => [
      () => ({code: ["a{b}c"], data: {b: {"g": 1, "h": 2}}, expected: ["a1c", "a2c"]}),
    ];

    let sample5 = () => [
      () => ({code: ["a{b}c{d}"], data: {b: 0, d: [1, 2]}, expected: ["a0c1", "a0c2"]}),
    ];

    let sample6 = () => [
      () => ({code: ["a{b}c{d}"], data: {b: [1, 2], d: 0}, expected: ["a1c0", "a2c0"]}),
      () => ({code: ["a{b}c{d}e{f}"], data: {b: [1, 2], d: 0, f: 10}, expected: ["a1c0e10", "a2c0e10"]}),
    ];

    let sample7 = () => [
      () => ({
        code: ["a{b}c{d}"],
        data: {
          b: [1, 2, 3],
          d: [4, 5]
        },
        expected: [
          "a1c4",
          "a1c5",
          "a2c4",
          "a2c5",
          "a3c4",
          "a3c5",
        ],
      }),
    ];

    pit('should return unchanged code if no matched data in substitutor', sample1, (data) => {
      let template = new Template(data.code, substitutor);

      expect(template.apply(data.data)).toEqual(data.expected);
    });

    pit('should replace placeholders with data', sample2, (data) => {
      let template = new Template(data.code, substitutor);

      expect(template.apply(data.data)).toEqual(data.expected);
    });

    pit('should turn array data to multiline', sample3, (data) => {
      let template = new Template(data.code, substitutor);

      expect(template.apply(data.data)).toEqual(data.expected);
    });

    pit('should turn object data to multiline by key', sample4, (data) => {
      let template = new Template(data.code, substitutor);

      expect(template.apply(data.data)).toEqual(data.expected);
    });

    pit('should properly substitute multiline before multiplying', sample5, (data) => {
      let template = new Template(data.code, substitutor);

      expect(template.apply(data.data)).toEqual(data.expected);
    });

    pit('should properly substitute multiline after multiplying', sample6, (data) => {
      let template = new Template(data.code, substitutor);

      expect(template.apply(data.data)).toEqual(data.expected);
    });

    pit('should properly substitute multiple multiplying', sample7, (data) => {
      let template = new Template(data.code, substitutor);

      expect(template.apply(data.data)).toEqual(data.expected);
    });

  });

});
