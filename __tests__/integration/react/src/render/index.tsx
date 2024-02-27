import { defineLoader, useLoaderData, useLoaderSWR } from '@smooth-data-loader/runtime-react';
import { defer } from 'react-router-dom';
import { get } from '../../../../utils/api';
import AsyncPart from '@/components/async';

interface Data {
  state: 'render'
}

const fetcher = () => {
  return defer({
    data: get('/api/render') as Promise<Data>,
  });
};

const { loader, swrData } = defineLoader(() => {
  return '/api/render';
}, fetcher);

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
