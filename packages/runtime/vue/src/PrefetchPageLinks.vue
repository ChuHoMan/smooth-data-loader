<script lang="ts" setup>
import { type RouteLocationNormalized, type RouteLocationRaw, type Router, useRouter } from 'vue-router';
import { HasDataLoaderMeta } from 'vue-router/auto';
import { isDataLoader } from './loader';
import { PRELOAD_PROMISES_KEY } from './symbols';

interface PrefetchPageLinksProps {
  to: RouteLocationRaw
}

const props = defineProps<PrefetchPageLinksProps>();

defineOptions({
  name: 'PrefetchPageLinks',
});

async function preloadRouteComponents(matched: any, router: Router = useRouter()) {
  if (!matched.length) {
    return;
  }

  // data-loader
  const components = matched.map((route: RouteLocationNormalized) => route?.meta[HasDataLoaderMeta]).filter(Boolean).flat(1);

  const promises = router[PRELOAD_PROMISES_KEY] = router[PRELOAD_PROMISES_KEY] || [];
  for (const comp of components) {
    const promise = Promise.resolve((comp as () => any)()).catch(() => {}).finally(() => promises.splice(promises.indexOf(promise))) as Promise<Record<string, unknown>>;

    promises.push(promise);
  }

  return Promise.all(promises);
}

function preloadRouteLoaderData(modules: Record<string | symbol, unknown>[], router: Router, route: RouteLocationNormalized) {
  if (!modules) {
    return;
  }

  modules.forEach((mod) => {
    const loaders = Object.keys(mod)
      .filter(exportName => isDataLoader(mod[exportName] as any))
      .map(loaderName => mod[loaderName] as Record<string, any>);

    Promise.all(loaders.map((loader) => {
      return loader?._.load(route, router);
    }));
  });
}

function usePrefetchPageLinks(props: PrefetchPageLinksProps) {
  const router = useRouter();

  const resolved = router.resolve(props.to as string) as RouteLocationNormalized;

  preloadRouteComponents(resolved.matched, router).then((modules) => {
    preloadRouteLoaderData(modules!, router, resolved);
  });
}

usePrefetchPageLinks(props);
</script>

<template>
  <slot />
</template>
