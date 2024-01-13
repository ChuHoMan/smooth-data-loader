import useSWR, { SWRConfiguration, SWRResponse, preload } from 'swr';
import {
  LoaderFunctionArgs, useParams,
} from 'react-router';
import { BlockingData, isFunction } from 'swr/_internal';

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

export type SWRLoaderFunction<Data> = (
  args: LoaderFunctionArgs
) => Promise<Data> | Data;
// key
export type ArgumentsTuple =
| [string, ...unknown[]]
| readonly [string, ...unknown[]];
export interface ArgumentsObject {
  [name: string]: any
  key: string
}
export type Arguments = string | ArgumentsTuple | ArgumentsObject;
export type Key = Arguments | (() => Arguments);

export interface FetcherArg<SWRKey extends Key = Key> {
  key: SWRKey
  /**
     * Route params parsed by react-router from dynamic segments and passed to your loader.
     */
  params: Record<string, string | undefined>
  request: {
    /**
       * current URL
       */
    url: string
  }
}
export interface TypedRespone<Data = unknown, Error = any> {
  data: Data
  error: Error
}
export type FetcherResponse<Data = unknown> = Data | Promise<Data>;
export type Fetcher<Data = unknown, SWRKey extends Key = Key> = (
  arg: FetcherArg<SWRKey>
) => FetcherResponse<Data>;

export interface SWRData<Data = any, SWRKey extends Key = Key> {
  key: SWRKey
  fetcher: Fetcher<Data, SWRKey>
}
export function defineLoader<
Data = any,
/* Error = any, */ SWRKey extends Key = Key,
>(
  key: SWRKey,
  fetcher: Fetcher<Data, SWRKey>,
): { loader: SWRLoaderFunction<Data>; swrData: SWRData<Data, SWRKey> } {
  return {
    loader: async (args) => {
      return preload(
        key,
        // params: args.params,
        // request: {
        // url: args.request.url,
        // },

        fetcher,
      );
    },
    swrData: {
      key,
      fetcher,
    },
  };
}

export interface SWRLoaderResponse<Data = any, Error = any, Config = any>
  extends Omit<SWRResponse<Data, Error, Config>, 'data'> {
  data: BlockingData<Data, Config> extends true ? Data : Data | undefined
}

export function useLoaderSWR<
Data = any,
Error = any,
SWRKey extends Key = Key,
SWROptions extends
  | SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>>
  | undefined =
  | SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>>
  | undefined,
>(
  swrData: SWRData<Data, SWRKey>,
  config?: SWROptions,
): SWRLoaderResponse<Data, Error, SWROptions> {
  const params = useParams();

  return useSWR(
    swrData.key,
    // {
    // key: swrData.key,
    // params: params,
    // request: {
    // url: location.toString(),
    // },
    // },
    swrData.fetcher,
    config,
  );
}
