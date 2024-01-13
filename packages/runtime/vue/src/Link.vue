<script lang="ts">
import { PropType, Ref, defineComponent, onMounted, onUnmounted, ref, toRef, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { intersectionObserver } from '@smooth-data-loader/runtime-core';
import PrefetchPageLinks from './PrefetchPageLinks.vue';

type PrefetchBehavior = 'intent' | 'render' | 'none' | 'viewport';

interface LinkProps {
  prefetch: PrefetchBehavior
}

function usePrefetch(prefetch: Ref<LinkProps['prefetch']>, props: Record<string, any>, emit) {
  const maybePrefetch = ref(false);
  const shouldPrefetch = ref(false);
  const prefetched = ref(false);
  const linkRef = ref(null);

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
        const { stop } = intersectionObserver(linkRef.value, callback);
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
      emit(theirHandler);
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

export default defineComponent({
  name: 'MisxLink',
  components: {
    RouterLink,
    PrefetchPageLinks,
  },
  inheritAttrs: false,
  props: {
    ...(RouterLink as any).props,
    prefetch: {
      type: String as PropType<PrefetchBehavior>,
      default: 'none',
    },
  },
  setup(props, {
    emit,
  }) {
    const prefetch = toRef(() => props.prefetch);

    const { linkRef, shouldPrefetch, prefetchHandles } = usePrefetch(prefetch, props, emit);

    return {
      prefetchHandles,
      linkRef,
      shouldPrefetch,
    };
  },
});
</script>

<template>
  <router-link
    v-slot="{ href, navigate }"
    v-bind="$props"
    @focus="prefetchHandles.onFocus"
    @blur="prefetchHandles.onBlur"
    @mouseenter="prefetchHandles.onMouseEnter"
    @mouseleave="prefetchHandles.onMouseLeave"
    @touchstart="prefetchHandles.onTouchStart"
  >
    <a
      v-bind="$attrs"
      ref="linkRef"
      :href="href"
      @click="navigate"
    >
      <slot />
    </a>
  </router-link>

  <prefetch-page-links
    v-if="shouldPrefetch"
    v-bind="$props"
  />
</template>
