/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	settings: { react: { version: 'detect' } },
	parser: '@typescript-eslint/parser',
	parserOptions: { ecmaFeatures: { jsx: true }, project: './tsconfig.json' },
	overrides: [{ extends: ['plugin:@typescript-eslint/disable-type-checked'], files: ['vite.config.ts'], }],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'prettier'
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'simple-import-sort'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'react/self-closing-comp': ['warn', { component: true, html: true }],
		'react/jsx-sort-props': ['warn', { shorthandFirst: true, callbacksLast: true }],
		'simple-import-sort/imports': 'warn',
		'simple-import-sort/exports': 'warn',
		'@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', args: 'after-used', argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-empty-function': 'warn',
		'@typescript-eslint/no-empty-interface': 'warn',
		'@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'inline-type-imports' }],
	}
}
