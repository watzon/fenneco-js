/** @ts-check @type import('eslint-config-standard-typescript-prettier/types').TsEslintConfig */
import config from 'eslint-config-standard-typescript-prettier'

module.exports = {
  ...config,
  parserOptions: { project: './tsconfig.json' },
  rules: {
    ...config.rules,
    '@typescript-eslint/no-explicit-any': 'error',
  },
}
