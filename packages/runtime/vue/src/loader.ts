import { IS_USE_DATA_LOADER_KEY } from 'unplugin-vue-router/runtime';

export function isDataLoader(loader: Record<string | symbol, unknown>) {
  return loader?.[IS_USE_DATA_LOADER_KEY];
}
