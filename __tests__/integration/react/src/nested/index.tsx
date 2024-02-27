import { SWRData, defineLoader, useLoaderData } from '@smooth-data-loader/runtime-react';
import { defer } from 'react-router-dom';
import { get } from '../../../../utils/api';
import AsyncPart from '@/components/async';

interface Data {
  state: 'nested'
}

const fetcher: SWRData['fetcher'] = (args) => {
  const url = `${args.url}?id=${args.id}`;
  return defer({
    data: get(url) as Promise<Data>,
  });
};

const { loader, swrData } = defineLoader((args) => {
  const { params } = args;
  return {
    url: `/api/nested`,
    id: params.id,
  };
}, (args) => {
  const url = `${args.url}?id=${args.id}`;
  return defer({
    data: get(url) as Promise<Data>,
  });
});

export {
  loader,
  swrData,
};

const Page = () => {
  const data = useLoaderData<typeof fetcher>();

  return (
    <>
      <div>part of page</div>
      <AsyncPart resolve={data.data} />
    </>
  );
};

export default Page;

export {
  Page as Component,
};
