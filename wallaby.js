module.exports = function (wallaby) {
    return {
        name: 'Intent compiler',

        files: [
            '**/*.ts',
            '**/packages/tests/src/**/*.ts',
            { pattern: '**/alchemy/alchemy.ts', ignore: true },
            { pattern: '**/*Spec.ts', ignore: true },
        ],

        tests: [
            '**/*Spec.ts',
        ],

        compilers: {
            '**/*.ts*': wallaby.compilers.typeScript({
                module: 'esnext',
                target: 'es2017',
            }),
        },

        env: {
            type: 'node',
        },

        testFramework: 'jasmine',
    };
};
