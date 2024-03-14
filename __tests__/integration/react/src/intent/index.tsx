import { defineLoader, useLoaderData } from '@smooth-data-loader/runtime-react';
import { defer } from 'react-router-dom';
import AsyncPart from '@/components/async';

const { loader, swrData } = defineLoader((params) => {
  return '/api/intent';
}, () => {
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
