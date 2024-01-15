<script lang="ts">
import { defineLoader, useRoute } from 'vue-router/auto';
import { get } from '../../../../../utils/api';

// name the loader however you want **and export it**
export const useViewportData = defineLoader(async (route) => {
  const data = await get('/api/viewport');
  // ...
  // return anything you want to expose
  return data;
}, {
  lazy: true,
  cacheTime: 10 * 1000,
});

export default {
  name: 'Viewport',
};
</script>

<script lang="ts" setup>
const { data, pending, error, refresh } = useViewportData();
const route = useRoute();
</script>

<template>
  <div v-if="pending">
    Loading...
  </div>
  <div v-else>
    {{ `${route.path} page, data is ${data.state || ''}` }}
  </div>
</template>
