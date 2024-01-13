import { FocusEventHandler, MouseEventHandler, TouchEventHandler, useEffect, useRef, useState } from 'react';
import { intersectionObserver } from '@smooth-data-loader/runtime-core';

/**
 * Defines the prefetching behavior of the link:
 *
 * - "none": Never fetched
 * - "intent": Fetched when the user focuses or hovers the link
 * - "render": Fetched when the link is rendered
 * - "viewport": Fetched when the link is in the viewport
 */
type PrefetchBehavior = 'intent' | 'render' | 'none' | 'viewport';

interface PrefetchHandlers {
  onFocus?: FocusEventHandler
  onBlur?: FocusEventHandler
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onTouchStart?: TouchEventHandler
}

interface PrefetchOptions {
  intersectConfig: IntersectionObserverInit
}

function composeEventHandlers<
  EventType extends React.SyntheticEvent | Event,
>(
  theirHandler: ((event: EventType) => any) | undefined,
  ourHandler: (event: EventType) => any,
): (event: EventType) => any {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}

/**
 * 预加载策略逻辑
 */
export function usePrefetch<T extends HTMLAnchorElement>(
  prefetch: PrefetchBehavior,
  otherProps: PrefetchHandlers,
  options?: PrefetchOptions,
): [boolean, React.RefObject<T>, Required<PrefetchHandlers>] {
  const ref = useRef<T>(null);
  const [maybePrefetch, setMaybePrefetch] = useState(false);
  const [shouldPrefetch, setShouldPrefetch] = useState(false);
  const [prefetched, setPrefetched] = useState(false);

  const { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart }
  = otherProps;
  const {
    intersectConfig,
  } = options || {};

  useEffect(() => {
    if (prefetch === 'render') {
      setShouldPrefetch(true);
      setPrefetched(true);
    }

    if (prefetch === 'viewport') {
      const callback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };

      let stopObserver = () => {};

      if (ref.current) {
        const { stop } = intersectionObserver(ref.current, callback, intersectConfig);

        stopObserver = stop;
      }

      return () => {
        stopObserver?.();
      };
    }
  }, [prefetch, intersectConfig]);

  const setIntent = () => {
    if (prefetch === 'intent' && !prefetched) {
      setMaybePrefetch(true);
    }
  };

  const cancelIntent = () => {
    if (prefetch === 'intent') {
      setMaybePrefetch(false);
      setShouldPrefetch(false);
    }
  };

  useEffect(() => {
    if (maybePrefetch) {
      const id = setTimeout(() => {
        setShouldPrefetch(true);
        setPrefetched(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);

  return [
    shouldPrefetch,
    ref,
    {
      onFocus: composeEventHandlers(onFocus, setIntent),
      onBlur: composeEventHandlers(onBlur, cancelIntent),
      onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
      onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
      onTouchStart: composeEventHandlers(onTouchStart, setIntent),
    },
  ];
}
