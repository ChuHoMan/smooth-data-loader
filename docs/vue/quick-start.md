# Quick Start

### Install

::: code-group

```shell [pnpm]
pnpm install @smooth-data-loader/runtime-vue
```

```shell [yarn]
yarn add @smooth-data-loader/runtime-vue
```

```shell [npm]
npm install @smooth-data-loader/runtime-vue
```

:::

:::warning
`unplugin-vue-router` version must >= 0.8.0
:::

### Usage

#### Step1

Setup DataLoaderPlugin,this is re-export with unplugin-vue-router.

```ts{2,10-13}
import { createApp } from 'vue';
import { DataLoaderPlugin } from '@smooth-data-loader/runtime-vue'

// whatever your router
const router = createRouter({
  history: createWebHistory(),
});

const app = createApp(App);
// must setup before router
app.use(DataLoaderPlugin, {
  router,
});
app.use(router);
```

#### Step2

Within your routing component, declare and export the defineLoader:

```vue{2-12,17}
<script lang="ts">
import { defineLoader } from '@smooth-data-loader/runtime-vue';

// name the loader however you want **and export it**
export const useRenderData = defineLoader(async (route) => {
  const data = await get('/api/render');
  // ...
  // return anything you want to expose
  return data;
}, {
  lazy: true,
});

</script>

<script lang="ts" setup>
const { data, isLoading } = useRenderData();
</script>

<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else>
    {{ `data is ${data.state || ''}` }}
  </div>
</template>
```

#### Step3

Change your original Vue Router Link Component to `SmoothLink`.


```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'; // [!code --]
import { SmoothLink } from '@smooth-data-loader/runtime-vue'; // [!code ++]
</script>

<template>
  <router-link to="/render">
    render
  </router-link> // [!code --]
  <smooth-link to="/render" prefetch="render">
    render
  </smooth-link> // [!code ++]
</template>
```