<script lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { HasDataLoaderMeta }  from 'vue-router/auto'
import { isDataLoader } from './loader'

async function preloadRouteComponents(matched: any, router = useRouter()) {

    if(!matched.length) return

    // data-loader
    const components = matched.map(comp => comp?.meta[HasDataLoaderMeta]).filter(Boolean).flat(1)

    const promises = router.__preloadPromises = router.__preloadPromises || []
    for(const comp of components) {
        const promise = Promise.resolve((comp as Function)()).catch(() => {}).finally(() => promises.splice(promises.indexOf(promise)))

        promises.push(promise)
    }

    return Promise.all(promises)
}

function preloadRouteLoaderData(modules: Record<string | symbol, unknown>[], router, route: any) {
    if(!modules) return

    modules.forEach((mod) => {
        const loaders = Object.keys(mod)
            .filter((exportName) => isDataLoader(mod[exportName] as any))
            .map(loaderName => mod[loaderName] as Record<string, any>)

        Promise.all(loaders.map(loader => {
            return  loader?._.load(route, router)  
        }))
    })
}

function usePrefetchPageLinks(props) {
    const router = useRouter();
    
    const resolved = router.resolve(props.to)


    preloadRouteComponents(resolved.matched, router).then((modules) => {
        preloadRouteLoaderData(modules!, router, resolved)
    })
}

export default {
  name: 'PrefetchPageLinks',
  props: {
    to: {
        type: String,
        default: ''
    }
  },
  setup(props) {
    usePrefetchPageLinks(props);

    return () => {}
  }
}
</script>