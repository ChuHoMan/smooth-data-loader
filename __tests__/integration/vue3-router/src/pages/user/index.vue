<script lang="ts">
import { defineLoader } from 'vue-router/auto';

// name the loader however you want **and export it**
export const useUserData = defineLoader(async (route) => {
  const user = await fetch('/api/state').then(res => res.json());
  // ...
  // return anything you want to expose
  return user;
}, {
  lazy: true,
  cacheTime: 10 * 1000,
});

export default {
  name: 'User',
};
</script>

<script lang="ts" setup>
const { data: user, pending, error, refresh } = useUserData();

console.log(user, pending);
</script>

<template>
  <div v-if="pending">
    正在等待数据
  </div>
  <div v-else>
    这是接口数据 {{ JSON.stringify(user) }}
  </div>
</template>
