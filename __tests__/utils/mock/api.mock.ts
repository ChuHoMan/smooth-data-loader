import { defineMock } from 'vite-plugin-mock-dev-server';

export default defineMock([
  {
    url: '/api/intent',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      state: 'intent',
    },
    delay: 1000,
  },
  {
    url: '/api/render',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      state: 'render',
    },
    delay: 1000,
  },
  {
    url: '/api/none',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      state: 'none',
    },
    delay: 1000,
  },
  {
    url: '/api/viewport',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      state: 'viewport',
    },
    delay: 1000,
  },
  {
    url: '/api/nested',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      state: 'nested',
    },
    delay: 1000,
  },
]);
