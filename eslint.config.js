import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import storybook from 'eslint-plugin-storybook';

export default tseslint.config(
  { ignores: ['node_modules', 'storybook-static', 'coverage', '.superpowers', 'docs/superpowers'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  storybook.configs['flat/recommended'],
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
);
