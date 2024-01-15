import { defineLoader, useLoaderData } from '@smooth-data-loader/runtime-react';
import { defer } from 'react-router-dom';
import { get } from '../../../../utils/api';
import AsyncPart from '@/components/async';

const { loader, swrData } = defineLoader((params) => {
  return '/api/render';
}, () => {
  return defer({
    data: get('/api/render'),
  });
});

export {
  loader,
  swrData,
};

const Page = () => {
  const data = useLoaderData() as {
    data: any
  };

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
