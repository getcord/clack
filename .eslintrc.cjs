module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'no-relative-import-paths',
    'react-hooks',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: '.',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended', // Must be last.
  ],
  settings: {
    'import/resolver': 'typescript',
    react: {
      version: '18.2',
    },
  },
  rules: {
    curly: 'error',
    'import/order': 'error',
    'import/no-duplicates': 'error',
    'import/no-restricted-paths': [
      'error',
      {
        basePath: './',
        zones: [
          { target: './src/client', from: './src/server' },
          { target: './src/server', from: './src/client' },
        ],
      },
    ],
    'no-relative-import-paths/no-relative-import-paths': 'error',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    "@typescript-eslint/ban-ts-comment": "off",
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowAny: true, allowNumber: true },
    ],
  },
  overrides: [
    {
      files: ['src/client/**'],
      rules: {
        'no-console': [
          'error',
          {
            allow: ['warn', 'error'],
          },
        ],
      },
    },
  ],
};
