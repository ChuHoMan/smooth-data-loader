<script lang="ts">
import { useRoute } from 'vue-router/auto';
import { defineLoader } from '@smooth-data-loader/runtime-vue';
import { get } from '../../../../../utils/api';

// name the loader however you want **and export it**
export const useIntentData = defineLoader(async (route) => {
  const data = await get('/api/intent');
  // ...
  // return anything you want to expose
  return data;
}, {
  lazy: true,
});

export default {
  name: 'Intent',
};
</script>

<script lang="ts" setup>
const { data, isLoading } = useIntentData();
const route = useRoute();
</script>

<template>
  <div v-if="isLoading">
    正在等待数据
  </div>
  <div v-else>
    {{ `${route.path} page, data is ${data?.state || ''}` }}
  </div>
</template>
