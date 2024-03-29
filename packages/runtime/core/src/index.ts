export function intersectionObserver(target: Element, callback: IntersectionObserverCallback, intersectConfig?: IntersectionObserverInit) {
  const isSupported = !!window.IntersectionObserver;
  if (!target || !isSupported) {
    return {
      isSupported,
      stop: () => {},
    };
  }

  const opts = {
    threshold: 0.5,
    ...(intersectConfig || {}),
  };

  const observer = new IntersectionObserver(callback, opts);

  requestIdleCallback(() => {
    observer.observe(target);
  }, {
    timeout: 1000,
  });

  function stop() {
    observer.disconnect();
  }

  return {
    isSupported,
    stop,
  };
}

export type {
  PrefetchBehavior,
} from './types';
