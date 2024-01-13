import { PRELOAD_PROMISES_KEY } from './symbols';

declare module 'vue-router' {
  export interface Router {
    [PRELOAD_PROMISES_KEY]: Promise<Record<string, unknown>>[]
  }
}
