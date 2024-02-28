const chuhoman = require('@chuhoman/eslint-config').default;

module.exports = chuhoman({
  ignores: [
    '**/node_modules/**',
    '**/.vitepress/cache/**',
    '*.svg',
    'dev-dist',
    'dist',
    '**/public/**',
    'pnpm-lock.yaml',
  ],
  react: true,
  vue: true,
  overrides: {
    markdown: {
      // 解决 md 编写 diff 语法时报错
      'react/jsx-no-comment-textnodes': 'off',
      'import/first': 'off',
      'import/no-duplicates': 'off',
      'style/jsx-one-expression-per-line': 'off',
    },
  },
}, {
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
});
