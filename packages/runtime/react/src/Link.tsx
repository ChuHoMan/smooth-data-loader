import { forwardRef, memo } from 'react';
import { Link, LinkProps, matchRoutes, useHref } from 'react-router-dom';
import { usePrefetch } from './hooks/usePrefetch';
import PrefetchPageLinks from './PrefetchPageLinks';

/**
 * Defines the prefetching behavior of the link:
 *
 * - "none": Never fetched
 * - "intent": Fetched when the user focuses or hovers the link
 * - "render": Fetched when the link is rendered
 * - "viewport": Fetched when the link is in the viewport
 */
type PrefetchBehavior = 'intent' | 'render' | 'none' | 'viewport';

type RouteType = NonNullable<ReturnType<typeof matchRoutes>>[number];

export interface SmoothLinkProps extends LinkProps {
  prefetch?: PrefetchBehavior
  prefetchOptions?: {
    /**
     * Triggered on prefetch
     */
    onPrefetch?(route: RouteType): Promise<void>
  }
}

const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

function mergeRefs<T = any>(...refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

const SmoothLink = forwardRef<HTMLAnchorElement, SmoothLinkProps>((props, forwardedRef) => {
  const { to, prefetch = 'none', prefetchOptions, ...restProps } = props;
  const isAbsolute = typeof to === 'string' && ABSOLUTE_URL_REGEX.test(to);

  const href = useHref(to);
  const [shouldPrefetch, ref, prefetchHandler] = usePrefetch(prefetch, restProps);

  return (
    <>
      <Link
        {...restProps}
        {...prefetchHandler}
        ref={mergeRefs(forwardedRef, ref)}
        to={to}
      />
      {
            (shouldPrefetch && !isAbsolute)
              ? <PrefetchPageLinks page={href} prefetchOptions={prefetchOptions} />
              : null
        }
    </>
  );
});

SmoothLink.displayName = 'SmoothLink';

export default memo(SmoothLink);
