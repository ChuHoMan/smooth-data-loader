import { memo, useContext, useEffect, useMemo } from 'react';
import { UNSAFE_DataRouterContext, matchRoutes } from 'react-router-dom';
import { preload } from 'swr';

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & Record<never, never>);

interface HtmlLinkProps {
  /**
   * Address of the hyperlink
   */
  href?: string

  /**
   * How the element handles crossorigin requests
   */
  crossOrigin?: 'anonymous' | 'use-credentials'

  /**
   * Relationship between the document containing the hyperlink and the destination resource
   */
  rel: LiteralUnion<
    | 'alternate'
    | 'dns-prefetch'
    | 'icon'
    | 'manifest'
    | 'modulepreload'
    | 'next'
    | 'pingback'
    | 'preconnect'
    | 'prefetch'
    | 'preload'
    | 'prerender'
    | 'search'
    | 'stylesheet',
    string
  >

  /**
   * Applicable media: "screen", "print", "(max-width: 764px)"
   */
  media?: string

  /**
   * Integrity metadata used in Subresource Integrity checks
   */
  integrity?: string

  /**
   * Language of the linked resource
   */
  hrefLang?: string

  /**
   * Hint for the type of the referenced resource
   */
  type?: string

  /**
   * Referrer policy for fetches initiated by the element
   */
  referrerPolicy?:
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'same-origin'
  | 'origin'
  | 'strict-origin'
  | 'origin-when-cross-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url'

  /**
   * Sizes of the icons (for rel="icon")
   */
  sizes?: string

  /**
   * Potential destination for a preload request (for rel="preload" and rel="modulepreload")
   */
  as?: LiteralUnion<
    | 'audio'
    | 'audioworklet'
    | 'document'
    | 'embed'
    | 'fetch'
    | 'font'
    | 'frame'
    | 'iframe'
    | 'image'
    | 'manifest'
    | 'object'
    | 'paintworklet'
    | 'report'
    | 'script'
    | 'serviceworker'
    | 'sharedworker'
    | 'style'
    | 'track'
    | 'video'
    | 'worker'
    | 'xslt',
    string
  >

  /**
   * Color to use when customizing a site's icon (for rel="mask-icon")
   */
  color?: string

  /**
   * Whether the link is disabled
   */
  disabled?: boolean

  /**
   * The title attribute has special semantics on this element: Title of the link; CSS style sheet set name.
   */
  title?: string

  /**
   * Images to use in different situations, e.g., high-resolution displays,
   * small monitors, etc. (for rel="preload")
   */
  imageSrcSet?: string

  /**
   * Image sizes for different page layouts (for rel="preload")
   */
  imageSizes?: string
}

interface HtmlLinkPreloadImage extends HtmlLinkProps {
  /**
   * Relationship between the document containing the hyperlink and the destination resource
   */
  rel: 'preload'

  /**
   * Potential destination for a preload request (for rel="preload" and rel="modulepreload")
   */
  as: 'image'

  /**
   * Address of the hyperlink
   */
  href?: string

  /**
   * Images to use in different situations, e.g., high-resolution displays,
   * small monitors, etc. (for rel="preload")
   */
  imageSrcSet: string

  /**
   * Image sizes for different page layouts (for rel="preload")
   */
  imageSizes?: string
}

/**
 * Represents a `<link>` element.
 *
 * WHATWG Specification: https://html.spec.whatwg.org/multipage/semantics.html#the-link-element
 */
export type HtmlLinkDescriptor =
  // Must have an href *unless* it's a `<link rel="preload" as="image">` with an
  // `imageSrcSet` and `imageSizes` props
  | (HtmlLinkProps & Pick<Required<HtmlLinkProps>, 'href'>)
  | (HtmlLinkPreloadImage & Pick<Required<HtmlLinkPreloadImage>, 'imageSizes'>)
  | (HtmlLinkPreloadImage &
  Pick<Required<HtmlLinkPreloadImage>, 'href'> & { imageSizes?: never });

export interface PrefetchPageDescriptor
  extends Omit<
    HtmlLinkDescriptor,
    | 'href'
    | 'rel'
    | 'type'
    | 'sizes'
    | 'imageSrcSet'
    | 'imageSizes'
    | 'as'
    | 'color'
    | 'title'
  > {
  /**
   * The absolute path of the page to prefetch.
   */
  page: string
}
/**
 */
function PrefetchPageLinks({
  page,
  prefetchOptions = {},
  ...dataLinkProps
}: PrefetchPageDescriptor & { prefetchOptions?: Record<string, any> }) {
  const { prefetchChunks } = prefetchOptions;
  const dataRouter = useContext(UNSAFE_DataRouterContext);

  const matches = useMemo(
    () => matchRoutes(dataRouter?.router.routes as any, page, dataRouter?.basename),
    [page, dataRouter?.basename, dataRouter?.router.routes],
  );

  if (!matches) {
    console.warn(`Tried to prefetch ${page} but no routes matched.`);
  }
  const matchRoute = Array.isArray(matches) ? matches[matches.length - 1] : null;

  useEffect(() => {
    if (matchRoute?.route?.path) {
      if (matchRoute.route?.lazy) {
        matchRoute.route.lazy?.().then((mod) => {
          const { swrData } = mod as Record<string, any>;
          preload(typeof swrData.key === 'function'
            ? swrData.key({
              params: matchRoute.params,
            })
            : swrData.key, swrData.fetcher);
        });
      } else if ((matchRoute.route as typeof matchRoute.route & {
        swrData: any // TODO: ts
      }).swrData) {
        const swrData = (matchRoute.route as typeof matchRoute.route & {
          swrData: any // TODO: ts
        }).swrData;
        preload(typeof swrData.key === 'function'
          ? swrData.key({
            params: matchRoute.params,
          })
          : swrData.key, swrData.fetcher);
      } else {
        // TODO: more information
        console.warn('[smooth-data-loader] can not found route module');
      }
    }
  }, [matchRoute]);

  // TODO: allow user pass link
  // const dataHrefs: string[] = [
  // ];
  return (
    <>
      {/* {dataHrefs.map((href: string) => (
        <link key={href} rel="preload" as="fetch" href={href} crossOrigin="use-credentials" {...dataLinkProps} />
      ))} */}
    </>
  );
}

export default memo(PrefetchPageLinks);
