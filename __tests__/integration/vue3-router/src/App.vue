<script setup lang="ts">
import { MisxLink } from '@smooth-data-loader/runtime-vue';
</script>

<template>
  <nav>
    <ul>
      <li style="height: 100vh;">
        <misx-link to="/">
          root
        </misx-link>
      </li>
      <li>
        <misx-link to="/user" prefetch="viewport">
          user
        </misx-link>
      </li>
    </ul>
  </nav>
  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
