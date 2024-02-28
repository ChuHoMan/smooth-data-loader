<script lang="ts">
import { useRoute } from 'vue-router/auto';
import { defineColadaLoader } from '@smooth-data-loader/runtime-vue';
import { get } from '../../../../../utils/api';

// name the loader however you want **and export it**
export const useViewportData = defineColadaLoader({
  query: async () => {
    const data = await get('/api/viewport');
    // ...
    // return anything you want to expose
    return data;
  },
  key: () => ['viewport'],
  lazy: true,
  staleTime: 10 * 1000,
});

export default {
  name: 'Viewport',
};
</script>

<script lang="ts" setup>
const { data, isLoading } = useViewportData();
const route = useRoute();
</script>

<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else>
    {{ `${route.path} page, data is ${data?.state || ''}` }}
  </div>
</template>
