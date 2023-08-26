// https://stryker-mutator.io/docs/stryker-js/guides/react/
// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
    packageManager: "yarn",
    reporters: ["html", "clear-text", "progress"],
    transpilers: [
        'typescript',
    ],
    tsconfigFile: './src/tsconfig.json',
    coverageAnalysis: "off",
    testRunner: "jasmine",
    jasmineConfigFile: './jasmine.json',
    mutate: [
        '**/*.ts',
        '!src/**/*Spec.ts',
    ],
};
export default config;
