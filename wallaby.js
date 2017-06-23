
module.exports = function (wallaby) {
  return {
    name: 'Intent compiler',

    files: [
      'src/**/*.ts',
      'tests/util/**/*.ts',
    ],

    tests: [
      'tests/**/*Spec.ts',
    ],

    compilers: {
      '**/*.ts*': wallaby.compilers.typeScript({
        module: "commonjs",
        target: "es5",
      })
    },

    env: {
      type: 'node',
    },

    testFramework: 'jasmine',
  };
};
