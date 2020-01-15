// This config was generated using a preset.
// Please see the handbook for more information: https://github.com/stryker-mutator/stryker-handbook/blob/master/stryker/guides/react.md#react
module.exports = function(config) {
  config.set({
    files: [
      '**/*.json',
    ],
    mutate: ['!**/*Spec.ts?(x)'],
    mutator: 'typescript',
    testFramework: 'jasmine',
    testRunner: 'jasmine',
    reporters: ['progress', 'clear-text', 'html'],
    // coverageAnalysis: 'perTest',
    transpilers: [
      'typescript'
      // You can specify more transpilers if needed
    ],
    tsconfigFile: 'tsconfig.json',
    jasmineConfigFile: './jasmine.json',
  });
};
