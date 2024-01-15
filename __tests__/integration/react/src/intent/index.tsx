import { defineLoader, useLoaderData } from '@smooth-data-loader/runtime-react';
import { defer } from 'react-router-dom';
import AsyncPart from '@/components/async';

const { loader, swrData } = defineLoader((params) => {
  console.log('params', params);

  return '/api/intent';
}, () => {
  console.log('loader');

  return defer({
    data: fetch('/api/intent', {
      method: 'get',
    }).then(res => res.json()),
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
