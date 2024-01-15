<script lang="ts">
import { defineLoader, useRoute } from 'vue-router/auto';
import { get } from '../../../../../utils/api';

// name the loader however you want **and export it**
export const useIntentData = defineLoader(async (route) => {
  const data = await get('/api/intent');
  // ...
  // return anything you want to expose
  return data;
}, {
  lazy: true,
  cacheTime: 10 * 1000,
});

export default {
  name: 'Intent',
};
</script>

<script lang="ts" setup>
const { data, pending } = useIntentData();
const route = useRoute();
</script>

<template>
  <div v-if="pending">
    正在等待数据
  </div>
  <div v-else>
    {{ `${route.path} page, data is ${data.state || ''}` }}
  </div>
</template>
