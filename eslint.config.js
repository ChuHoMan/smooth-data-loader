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
}, {
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
});
