module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
    'max-len': ['error', {"code": 150}],
    'arrow-parens': 0,
    "object-curly-spacing": ["error", "always"],
    'func-call-spacing': ["error", "never"],
    'object-literal-sort-keys': 0,
  },
  overrides: [
    {
      files: ['*.js'],
      parser: 'babel-eslint',
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        // '@typescript-eslint/explicit-member-accessibility': 0,
      },
    },
  ],
};
