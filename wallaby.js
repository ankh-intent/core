
module.exports = function (wallaby) {
	return {
		files: [
			'src/**/*.ts',
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
