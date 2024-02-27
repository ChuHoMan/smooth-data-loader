// RIC and shim for browsers setTimeout() without it
export const requestIdleCallback = window.requestIdleCallback
  || function (cb: IdleRequestCallback) {
    const start = Date.now();
    return setTimeout(() => {
      // eslint-disable-next-line node/no-callback-literal
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

export const inBrowser = typeof window !== 'undefined';

const conn = inBrowser && (navigator as any).connection;
export const canPrefetch
  = inBrowser
  && (!conn || (!(conn.effectiveType || '').includes('2g') && !conn.saveData));

export const supportIntersectionObserver
  = inBrowser && window.IntersectionObserver;

export function isFunction<T extends(...args: any[]) => any = (...args: any[]) => any>(v: unknown): v is T {
  return typeof v === 'function';
}
