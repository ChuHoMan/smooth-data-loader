import useSWR, { SWRConfiguration, SWRResponse, preload } from 'swr';
import {
  LoaderFunctionArgs,
  useLoaderData as _useLoaderData,
  useParams,
} from 'react-router';
import { BlockingData } from 'swr/_internal';
import { isFunction } from './utils';

export type SWRLoaderFunction<Data> = (
  args: LoaderFunctionArgs
) => Promise<Data> | Data | any;
// key
export type ArgumentsTuple =
  | [string, ...unknown[]]
  | readonly [string, ...unknown[]];
export interface ArgumentsObject {
  [name: string]: any
}

interface KeyArg {
  /**
    * Route params parsed by react-router from dynamic segments and passed to your loader.
  */
  params: Record<string, string | undefined>
}

export type Arguments = string | ArgumentsTuple | ArgumentsObject;
export type Key = Arguments | ((key: KeyArg) => Arguments);

export type FetcherArg = Arguments;
export type FetcherResponse<Data = unknown> = Data | Promise<Data>;
export type Fetcher<Data = unknown, SWRKey extends Key = Key> = SWRKey extends (key: KeyArg) => infer Arg | null | undefined | false ? (arg: Arg) => FetcherResponse<Data> : SWRKey extends null | undefined | false ? never : SWRKey extends infer Arg ? (arg: Arg) => FetcherResponse<Data> : never;

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
        isFunction(key) ? key(args) : key,
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

  const finalKey = isFunction(swrData.key)
    ? swrData.key({
      params,
    })
    : swrData.key;

  return useSWR(
    finalKey,
    swrData.fetcher,
    config as any,
  ) as any;
}

export type { LoaderFunctionArgs };
export type LoaderFunction<Data> = (
  args: LoaderFunctionArgs
) => Promise<Data | undefined> | Data | undefined;

/**
 * Infer the data type of a loader function.
 */
export type LoaderDataType<
T extends LoaderFunction<unknown>,
R = Exclude<ReturnType<T>, Promise<ReturnType<T>>>,
> = R;
/**
 * Type safe loader data hook for React Router.
 *
 * @returns The data from the current route's loader function.
 */
export function useLoaderData<T extends LoaderFunction<unknown>>() {
  return _useLoaderData() as LoaderDataType<T>;
}
