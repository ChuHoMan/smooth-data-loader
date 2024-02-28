import SmoothLink from './Link.vue';

export type {
  PrefetchBehavior,
} from '@smooth-data-loader/runtime-core';

export {
  SmoothLink,
};

export {
  defineBasicLoader as defineLoader,
} from 'unplugin-vue-router/data-loaders/basic';

export {
  defineColadaLoader,
} from 'unplugin-vue-router/data-loaders/pinia-colada';

export {
  DataLoaderPlugin,
} from 'unplugin-vue-router/runtime';
