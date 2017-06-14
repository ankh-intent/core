
module.exports = function (wallaby) {
  return {
    name: 'Intent compiler',

    files: [
      'src/**/*.ts',
    ],

    tests: [
      'tests/**/*.ts',
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
