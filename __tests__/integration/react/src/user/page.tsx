import { defineLoader, preload, useLoaderData, useLoaderSWR } from '@smooth-data-loader/runtime-react';
import { Suspense } from 'react';
import { Await, defer, useAsyncValue } from 'react-router-dom';

// preload(swrData.key, swrData.fetcher)

function PackageLocation() {
  const data = useAsyncValue();
  return (
    <p>
      user page, data is
      {' '}
      {JSON.stringify(data || {})}
      ;
    </p>
  );
}

const { loader, swrData } = defineLoader((params) => {
  console.log('params', params);

  return '/api/state';
}, () => {
  console.log('loader');

  return defer({
    data: fetch('/api/state', {
      credentials: 'include',
    }).then(res => res.json()),
  });
});

export {
  loader,
  swrData,
};

const Page = () => {
  // const data = useLoaderSWR(swrData, {
  //   revalidateIfStale: false,
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  // })
  const data = useLoaderData() as {
    data: any
  };

  console.log(data);
  return (
    <>
      <div>这是可以提前看到的页面内容</div>
      <Suspense fallback={<p>Loading...</p>}>
        <Await
          resolve={data.data}
          errorElement={
            <p>Error loading package location!</p>
          }
        >
          <PackageLocation />
        </Await>
      </Suspense>
    </>
  );
};

export default Page;

export {
  Page as Component,
};
