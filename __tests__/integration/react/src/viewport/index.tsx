import { defineLoader, useLoaderData, useLoaderSWR } from '@smooth-data-loader/runtime-react';
import { defer } from 'react-router-dom';
import { get } from '../../../../utils/api';
import AsyncPart from '@/components/async';

interface Data {
  state: 'viewport'
}

const fetcher = () => {
  return defer({
    data: get('/api/viewport') as Promise<Data>,
  });
};

const { loader, swrData } = defineLoader(() => {
  return '/api/viewport';
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
