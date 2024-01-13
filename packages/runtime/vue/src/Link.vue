<script lang="ts" setup>
import { ComponentPublicInstance, Ref, onMounted, onUnmounted, ref, toRef, watch } from 'vue';
import { RouterLink, RouterLinkProps } from 'vue-router';
import { PrefetchBehavior, intersectionObserver } from '@smooth-data-loader/runtime-core';
import PrefetchPageLinks from './PrefetchPageLinks.vue';

interface LinkProps extends RouterLinkProps {
  prefetch?: PrefetchBehavior
}

const props = withDefaults(defineProps<LinkProps>(), {
  prefetch: 'none',
});

const emits = defineEmits<{
  focus: [e: Event]
  blur: [e: Event]
  mouseenter: [e: Event]
  mouseleave: [e: Event]
  touchstart: [e: Event]
}>();

defineOptions({
  name: 'SmoothLink',
  components: {
    RouterLink,
    PrefetchPageLinks,
  },
  inheritAttrs: false,
});

function usePrefetch(prefetch: Ref<LinkProps['prefetch']>, _: LinkProps, emit: typeof emits) {
  const maybePrefetch = ref(false);
  const shouldPrefetch = ref(false);
  const prefetched = ref(false);
  const linkRef = ref<ComponentPublicInstance<typeof RouterLink> | null>(null);

  if (prefetch.value === 'render') {
    shouldPrefetch.value = true;
    prefetched.value = true;
  } else if (prefetch.value === 'viewport') {
    let stopObserver: () => any;
    onMounted(() => {
      const callback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          shouldPrefetch.value = entry.isIntersecting;
        });
      };

      if (linkRef.value) {
        const { stop } = intersectionObserver(linkRef.value.$el, callback);
        stopObserver = stop;
      }
    });

    onUnmounted(() => {
      stopObserver?.();
    });
  }

  let timeId: number | null = null;
  watch(maybePrefetch, (value) => {
    if (value) {
      timeId = setTimeout(() => {
        shouldPrefetch.value = true;
        prefetched.value = true;
      }, 100) as unknown as number;
    } else {
      clearTimeout(timeId as any);
    }
  }, {
    immediate: true,
  });

  onUnmounted(() => {
    if (timeId) {
      clearTimeout(timeId);
    }
  });

  function setIntent() {
    if (prefetch.value === 'intent' && !prefetched.value) {
      maybePrefetch.value = true;
    }
  }

  function cancelIntent() {
    if (prefetch.value === 'intent') {
      maybePrefetch.value = false;
      shouldPrefetch.value = false;
    }
  }

  function composeEventHandlers(theirHandler: string, ourHandler: (e: Event) => any) {
    return (e: Event) => {
      emit(theirHandler as any, e);
      ourHandler(e);
    };
  }

  return {
    linkRef,
    shouldPrefetch,
    prefetchHandles: {
      onFocus: composeEventHandlers('focus', setIntent),
      onBlur: composeEventHandlers('blur', cancelIntent),
      onMouseEnter: composeEventHandlers('mouseenter', setIntent),
      onMouseLeave: composeEventHandlers('mouseleave', cancelIntent),
      onTouchStart: composeEventHandlers('touchstart', setIntent),
    },
  };
}

const prefetch = toRef(() => props.prefetch);

const { linkRef, shouldPrefetch, prefetchHandles } = usePrefetch(prefetch, props, emits);
</script>

<template>
  <router-link
    v-bind="$props"
    ref="linkRef"
    @focus="prefetchHandles.onFocus"
    @blur="prefetchHandles.onBlur"
    @mouseenter="prefetchHandles.onMouseEnter"
    @mouseleave="prefetchHandles.onMouseLeave"
    @touchstart="prefetchHandles.onTouchStart"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </router-link>

  <prefetch-page-links
    v-if="shouldPrefetch"
    :to="to"
  />
</template>
