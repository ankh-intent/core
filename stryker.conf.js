// https://github.com/stryker-mutator/stryker-handbook/blob/master/stryker/guides/react.md#react
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
    ],
    tsconfigFile: './src/tsconfig.json',
    jasmineConfigFile: './jasmine.json',
  });
};
