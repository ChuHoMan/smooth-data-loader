<script setup lang="ts">
import { SmoothLink } from '@smooth-data-loader/runtime-vue';
</script>

<template>
  <RouterView />
  <nav>
    <ul>
      <li style="height: 100vh;">
        <smooth-link to="/">
          root
        </smooth-link>
        <smooth-link to="/render" prefetch="render">
          render
        </smooth-link>
        <smooth-link to="/none" prefetch="none">
          none
        </smooth-link>
        <smooth-link to="/intent" prefetch="intent">
          intent
        </smooth-link>
      </li>
      <li>
        <smooth-link to="/viewport" prefetch="viewport">
          viewport
        </smooth-link>
      </li>
    </ul>
  </nav>
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
