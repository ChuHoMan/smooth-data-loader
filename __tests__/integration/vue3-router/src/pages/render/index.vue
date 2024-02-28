<script lang="ts">
import { useRoute } from 'vue-router/auto';
import { defineLoader } from '@smooth-data-loader/runtime-vue';
import { get } from '../../../../../utils/api';

// name the loader however you want **and export it**
export const useRenderData = defineLoader(async (route) => {
  const data = await get('/api/render');
  // ...
  // return anything you want to expose
  return data;
}, {
  lazy: true,
});

export default {
  name: 'Render',
};
</script>

<script lang="ts" setup>
const { data, isLoading } = useRenderData();
const route = useRoute();
</script>

<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else>
    {{ `${route.path} page, data is ${data.state || ''}` }}
  </div>
</template>
